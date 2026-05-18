import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { DatabaseService } from '../database/database.service';
import { EncryptionService } from '../security/encryption.service';
import { SignupDto, SigninDto, LinkDto } from '../bankid/dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService
  ) {}

  async signupWithBankID(signupDto: SignupDto) {
    const { personalNumber, name, email } = signupDto;
    const supabase = this.supabaseService.getClient();

    this.logger.log(`Signup request: ${personalNumber}, ${name}`);

    // Använd personnummer som email om email inte anges
    let userEmail = email || `${personalNumber}@bankid.local`;

    const personalNumberHash = await this.encryptionService.hashValue(
      personalNumber,
      'personal_number'
    );
    const encryptedPersonalNumber = await this.encryptionService.encryptString(
      personalNumber
    );

    // Kontrollera om användaren redan finns (hash)
    const existingUserResult = await this.databaseService.query<{
      id: string;
      email: string;
      name: string;
      personal_number_hash?: string | null;
      personal_number?: string | null;
    }>(
      'SELECT id, email, name, personal_number_hash, personal_number FROM public.users WHERE personal_number_hash = $1 LIMIT 1',
      [personalNumberHash]
    );
    let existingUser = existingUserResult.rows[0] || null;

    // Fallback för legacy-data (plain personal_number)
    if (!existingUser) {
      const legacyUserResult = await this.databaseService.query<{
        id: string;
        email: string;
        name: string;
        personal_number?: string | null;
      }>(
        'SELECT id, email, name, personal_number FROM public.users WHERE personal_number = $1 LIMIT 1',
        [personalNumber]
      );
      existingUser = legacyUserResult.rows[0] || null;

      if (existingUser) {
        await this.databaseService.query(
          `UPDATE public.users SET
             personal_number_hash = $1,
             personal_number_encrypted = $2,
             personal_number = NULL,
             updated_at = NOW()
           WHERE id = $3`,
          [personalNumberHash, encryptedPersonalNumber, existingUser.id]
        );
      }
    }

    // Kontrollera också i auth.users
    let existingAuthUser: any = null;
    try {
      const { data: { users } } = await supabase.auth.admin.listUsers();
      if (users && Array.isArray(users)) {
        existingAuthUser = users.find(
          (u: any) =>
            u.email === userEmail ||
            u.user_metadata?.personal_number === personalNumber
        ) || null;
      }
    } catch (error) {
      this.logger.warn('Could not list users:', error);
    }

    let authData: any = null;
    let insertedUser: any = null;

    // Om användaren redan finns
    if (existingUser || existingAuthUser) {
      const userToUse = existingUser || (existingAuthUser ? {
        id: existingAuthUser.id,
        email: existingAuthUser.email || userEmail,
        name: existingAuthUser.user_metadata?.name || name,
      } : null);
      
      if (!userToUse) {
        throw new BadRequestException('Kunde inte hitta användardata');
      }

      this.logger.warn(
        `User already exists, using existing user: ${userToUse.id}`
      );

      if (existingAuthUser) {
        authData = { user: existingAuthUser };
      } else if (existingUser) {
        const { data: authUser } = await supabase.auth.admin.getUserById(
          existingUser.id
        );
        if (authUser) {
          authData = { user: authUser.user };
        } else {
          throw new BadRequestException(
            'Konto finns redan men är i felaktigt tillstånd. Kontakta support.'
          );
        }
      }

      // Uppdatera users-tabellen
      const userIdToUpdate = existingUser?.id || existingAuthUser?.id;
      if (userIdToUpdate) {
        const personalNumberCheckResult =
          await this.databaseService.query<{ id: string }>(
            'SELECT id FROM public.users WHERE personal_number_hash = $1 AND id != $2 LIMIT 1',
            [personalNumberHash, userIdToUpdate]
          );
        const personalNumberCheck = personalNumberCheckResult.rows[0] || null;

        const updateData: any = {
          email: userToUse.email,
          name: name || userToUse.name,
          bankid_linked: true,
          bankid_linked_at: new Date().toISOString(),
        };

        if (!personalNumberCheck) {
          updateData.personal_number_hash = personalNumberHash;
          updateData.personal_number_encrypted = encryptedPersonalNumber;
          updateData.personal_number = null;
        }

        try {
          await this.databaseService.query(
            `INSERT INTO public.users (
               id,
               email,
               name,
               personal_number,
               personal_number_hash,
               personal_number_encrypted,
               bankid_linked,
               bankid_linked_at
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO UPDATE SET
               email = EXCLUDED.email,
               name = EXCLUDED.name,
               personal_number = EXCLUDED.personal_number,
               personal_number_hash = EXCLUDED.personal_number_hash,
               personal_number_encrypted = EXCLUDED.personal_number_encrypted,
               bankid_linked = EXCLUDED.bankid_linked,
               bankid_linked_at = EXCLUDED.bankid_linked_at,
               updated_at = NOW()`,
            [
              userIdToUpdate,
              updateData.email,
              updateData.name,
              updateData.personal_number || null,
              updateData.personal_number_hash || null,
              updateData.personal_number_encrypted || null,
              updateData.bankid_linked,
              updateData.bankid_linked_at,
            ]
          );
        } catch (updateError: any) {
          if (
            updateError.code === '23505' &&
            (updateError.message?.includes('personal_number') ||
              updateError.message?.includes('personal_number_hash'))
          ) {
            // Retry without personal_number
            await this.databaseService.query(
              `UPDATE public.users SET
                 email = $1,
                 name = $2,
                 bankid_linked = $3,
                 bankid_linked_at = $4,
                 updated_at = NOW()
               WHERE id = $5`,
              [
                userToUse.email,
                name || userToUse.name,
                true,
                new Date().toISOString(),
                userIdToUpdate,
              ]
            );

          } else {
            throw new BadRequestException(
              `Kunde inte uppdatera användardata: ${updateError.message}`
            );
          }
        }

        const updatedUserResult = await this.databaseService.query(
          'SELECT * FROM public.users WHERE id = $1 LIMIT 1',
          [userIdToUpdate]
        );
        const updatedUser = updatedUserResult.rows[0] || null;

        if (updatedUser) {
          insertedUser = updatedUser;
        } else if (existingUser) {
          insertedUser = existingUser;
        }
      }
    } else {
      // Skapa ny användare
      this.logger.log(`Creating new user with email: ${userEmail}`);

      const { data: newAuthData, error: createAuthError } =
        await supabase.auth.admin.createUser({
          email: userEmail,
          email_confirm: true,
          user_metadata: {
            name: name,
            personal_number: personalNumber,
            bankid_linked: true,
          },
        });

      if (createAuthError) {
        // Om email redan används, försök hitta användaren
        if (
          createAuthError.message?.includes('already registered') ||
          createAuthError.message?.includes('already exists') ||
          createAuthError.status === 422
        ) {
          const { data: { users } } = await supabase.auth.admin.listUsers();
          const existingAuthUserFound = users && Array.isArray(users) ? users.find(
            (u: any) =>
              u.email === userEmail ||
              u.user_metadata?.personal_number === personalNumber
          ) : null;

          if (existingAuthUserFound) {
            authData = { user: existingAuthUserFound };
            userEmail = existingAuthUserFound.email || userEmail;
          } else {
            userEmail = `${personalNumber}-${Date.now()}@bankid.local`;
            const { data: retryAuthData, error: retryError } =
              await supabase.auth.admin.createUser({
                email: userEmail,
                email_confirm: true,
                user_metadata: {
                  name: name,
                  personal_number: personalNumber,
                  bankid_linked: true,
                },
              });

            if (retryError) {
              throw new BadRequestException(
                `Kunde inte skapa användare: ${retryError.message}`
              );
            }

            authData = retryAuthData;
          }
        } else {
          throw new BadRequestException(
            createAuthError.message || 'Kunde inte skapa användare'
          );
        }
      } else {
        authData = newAuthData;
        this.logger.log(`New user created in auth: ${authData.user.id}`);
      }

      if (!authData) {
        throw new BadRequestException('Kunde inte skapa användare');
      }

      // Spara i users-tabellen
      try {
        const upsertedUserResult = await this.databaseService.query(
          `INSERT INTO public.users (
             id,
             email,
             name,
             personal_number,
             personal_number_hash,
             personal_number_encrypted,
             bankid_linked,
             bankid_linked_at
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET
             email = EXCLUDED.email,
             name = EXCLUDED.name,
             personal_number = EXCLUDED.personal_number,
             personal_number_hash = EXCLUDED.personal_number_hash,
             personal_number_encrypted = EXCLUDED.personal_number_encrypted,
             bankid_linked = EXCLUDED.bankid_linked,
             bankid_linked_at = EXCLUDED.bankid_linked_at,
             updated_at = NOW()
           RETURNING *`,
          [
            authData.user.id,
            userEmail,
            name,
            null,
            personalNumberHash,
            encryptedPersonalNumber,
            true,
            new Date().toISOString(),
          ]
        );
        insertedUser = upsertedUserResult.rows[0];
      } catch (dbError: any) {
        if (
          dbError.message?.includes('duplicate key') ||
          dbError.code === '23505'
        ) {
          const existingUserDataResult = await this.databaseService.query(
            'SELECT * FROM public.users WHERE id = $1 LIMIT 1',
            [authData.user.id]
          );

          if (existingUserDataResult.rows[0]) {
            insertedUser = existingUserDataResult.rows[0];
            await this.databaseService.query(
              `UPDATE public.users SET
                 bankid_linked = $1,
                 bankid_linked_at = $2,
                 name = $3,
                 updated_at = NOW()
               WHERE id = $4`,
              [true, new Date().toISOString(), name, authData.user.id]
            );
          } else {
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw new BadRequestException(
              `Kunde inte spara användardata: ${dbError.message}`
            );
          }
        } else {
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new BadRequestException(
            `Kunde inte spara användardata: ${dbError.message}`
          );
        }
      }
    }

    // Hämta användaren om den inte finns
    if (!insertedUser && authData?.user?.id) {
      const fetchedUserResult = await this.databaseService.query(
        'SELECT * FROM public.users WHERE id = $1 LIMIT 1',
        [authData.user.id]
      );

      if (fetchedUserResult.rows[0]) {
        insertedUser = fetchedUserResult.rows[0];
      }
    }

    // Generera magic link för session
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'http://localhost:5173';
    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
      options: {
        redirectTo: `${frontendUrl}/auth/callback`,
      },
    });

    let token = null;
    let tokenHash = null;
    let actionLink = null;

    if (linkData && linkData.properties && linkData.properties.action_link) {
      const url = new URL(linkData.properties.action_link);
      token = url.searchParams.get('token');
      tokenHash = url.searchParams.get('token_hash');
      actionLink = linkData.properties.action_link;
    }

    if (!authData || !authData.user) {
      throw new BadRequestException('Kunde inte skapa användare');
    }

    this.logger.log(`User created: ${authData.user.id}`);

    return {
      success: true,
      userId: authData.user.id,
      email: userEmail,
      name: name,
      token: token,
      tokenHash: tokenHash,
      actionLink: actionLink,
      message: 'Konto skapat framgångsrikt',
    };
  }

  async signinWithBankID(signinDto: SigninDto) {
    const { personalNumber, name } = signinDto;
    const supabase = this.supabaseService.getClient();

    this.logger.log(`Signin request: ${personalNumber}, ${name}`);

    const personalNumberHash = await this.encryptionService.hashValue(
      personalNumber,
      'personal_number'
    );
    const encryptedPersonalNumber = await this.encryptionService.encryptString(
      personalNumber
    );

    // Hitta användare via personalNumber (hash först)
    const userResult = await this.databaseService.query<{
      id: string;
      email: string;
      name: string;
      personal_number?: string | null;
      personal_number_hash?: string | null;
    }>(
      'SELECT id, email, name, personal_number, personal_number_hash FROM public.users WHERE personal_number_hash = $1 LIMIT 1',
      [personalNumberHash]
    );
    let user = userResult.rows[0] || null;

    // Fallback för legacy-data (plain personal_number)
    if (!user) {
      const legacyUserResult = await this.databaseService.query<{
        id: string;
        email: string;
        name: string;
        personal_number?: string | null;
      }>(
        'SELECT id, email, name, personal_number FROM public.users WHERE personal_number = $1 LIMIT 1',
        [personalNumber]
      );
      user = legacyUserResult.rows[0] || null;

      if (user) {
        await this.databaseService.query(
          `UPDATE public.users SET
             personal_number_hash = $1,
             personal_number_encrypted = $2,
             personal_number = NULL,
             updated_at = NOW()
           WHERE id = $3`,
          [personalNumberHash, encryptedPersonalNumber, user.id]
        );
      }
    }

    if (!user) {
      // Auto-signup om kontot inte finns
      this.logger.warn('User not found, creating automatically...');
      return await this.signupWithBankID({
        personalNumber,
        name,
        email: undefined,
      });
    }

    // Uppdatera användarens profil
    const personalNumberCheckResult =
      await this.databaseService.query<{ id: string }>(
        'SELECT id FROM public.users WHERE personal_number_hash = $1 AND id != $2 LIMIT 1',
        [personalNumberHash, user.id]
      );
    const personalNumberCheck = personalNumberCheckResult.rows[0] || null;

    const updateData: any = {
      name: name || user.name,
      bankid_linked: true,
      bankid_linked_at: new Date().toISOString(),
    };

    if (!personalNumberCheck) {
      updateData.personal_number_hash = personalNumberHash;
      updateData.personal_number_encrypted = encryptedPersonalNumber;
      updateData.personal_number = null;
    }

    try {
      await this.databaseService.query(
        `UPDATE public.users SET
           name = $1,
           personal_number = $2,
           personal_number_hash = $3,
           personal_number_encrypted = $4,
           bankid_linked = $5,
           bankid_linked_at = $6,
           updated_at = NOW()
         WHERE id = $7`,
        [
          updateData.name,
          updateData.personal_number || null,
          updateData.personal_number_hash || null,
          updateData.personal_number_encrypted || null,
          updateData.bankid_linked,
          updateData.bankid_linked_at,
          user.id,
        ]
      );
    } catch (updateError: any) {
        if (
          updateError.code === '23505' &&
          (updateError.message?.includes('personal_number') ||
            updateError.message?.includes('personal_number_hash'))
        ) {
        // Retry without personal_number
        await this.databaseService.query(
          `UPDATE public.users SET
             name = $1,
               bankid_linked = $2,
               bankid_linked_at = $3,
             updated_at = NOW()
           WHERE id = $4`,
          [name || user.name, true, new Date().toISOString(), user.id]
        );
      }
    }

    // Hämta auth-användare
    const { data: authUser } = await supabase.auth.admin.getUserById(user.id);

    if (!authUser) {
      throw new BadRequestException('Kunde inte hämta användarinformation');
    }

    // Generera magic link för session
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'http://localhost:5173';
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: user.email,
        options: {
          redirectTo: `${frontendUrl}/auth/callback`,
        },
      });

    if (linkError || !linkData) {
      this.logger.warn('Could not generate session link, using fallback');
      return {
        success: true,
        userId: user.id,
        email: user.email,
        name: user.name,
        message: 'Inloggning lyckades (fallback mode)',
      };
    }

    const url = new URL(linkData.properties.action_link);
    const token = url.searchParams.get('token');
    const tokenHash = url.searchParams.get('token_hash');

    this.logger.log(`User signed in: ${user.id}`);

    return {
      success: true,
      userId: user.id,
      email: user.email,
      name: user.name,
      token: token,
      tokenHash: tokenHash,
      actionLink: linkData.properties.action_link,
      message: 'Inloggning lyckades',
    };
  }

  async linkBankID(linkDto: LinkDto & { userId: string }) {
    const { personalNumber, name, userId } = linkDto;
    const supabase = this.supabaseService.getClient();

    if (!userId) {
      throw new BadRequestException('UserId saknas för att koppla BankID');
    }

    this.logger.log(`Linking BankID to user: ${userId}`);

    // Kontrollera om personal_number redan används
    const personalNumberHash = await this.encryptionService.hashValue(
      personalNumber,
      'personal_number'
    );
    const encryptedPersonalNumber = await this.encryptionService.encryptString(
      personalNumber
    );

    const existingUserResult = await this.databaseService.query<{ id: string }>(
      'SELECT id FROM public.users WHERE personal_number_hash = $1 AND id != $2 LIMIT 1',
      [personalNumberHash, userId]
    );

    if (existingUserResult.rows[0]) {
      throw new BadRequestException(
        'Detta personnummer är redan kopplat till ett annat konto'
      );
    }

    // Uppdatera användaren
    try {
      await this.databaseService.query(
        `UPDATE public.users SET
           personal_number = $1,
           personal_number_hash = $2,
           personal_number_encrypted = $3,
           name = $4,
           bankid_linked = $5,
           bankid_linked_at = $6,
           updated_at = NOW()
         WHERE id = $7`,
        [
          null,
          personalNumberHash,
          encryptedPersonalNumber,
          name,
          true,
          new Date().toISOString(),
          userId,
        ]
      );
    } catch (updateError: any) {
      throw new BadRequestException(
        `Kunde inte koppla BankID: ${updateError.message}`
      );
    }

    // Uppdatera auth metadata
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    if (authUser && authUser.user) {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...(authUser.user.user_metadata || {}),
          personal_number: personalNumber,
          name: name,
          bankid_linked: true,
        },
      });
    }

    this.logger.log(`BankID linked to user: ${userId}`);

    return {
      success: true,
      message: 'BankID kopplad framgångsrikt',
    };
  }

  async unlinkBankID(userId: string) {
    const supabase = this.supabaseService.getClient();

    this.logger.log(`Unlinking BankID from user: ${userId}`);

    try {
      await this.databaseService.query(
        `UPDATE public.users SET
           bankid_linked = $1,
           bankid_linked_at = $2,
           updated_at = NOW()
         WHERE id = $3`,
        [false, null, userId]
      );
    } catch (updateError: any) {
      throw new BadRequestException(
        `Kunde inte ta bort BankID-koppling: ${updateError.message}`
      );
    }

    return {
      success: true,
      message: 'BankID-koppling borttagen',
    };
  }
}

