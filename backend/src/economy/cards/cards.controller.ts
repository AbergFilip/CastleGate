import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { SandboxBankService } from '../sandbox-bank/sandbox-bank.service';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@ApiTags('Cards')
@Controller('cards')
@ApiBearerAuth()
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly sandboxBankService: SandboxBankService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all cards for current user' })
  @ApiResponse({ status: 200, description: 'Cards retrieved successfully' })
  async getCards(@CurrentUserId() userId: string) {
    return await this.cardsService.getCards(userId);
  }

  @Get('sandbox/banks')
  @ApiOperation({ summary: 'List available sandbox banks for cards' })
  async getSandboxBanks() {
    return { ok: true, banks: this.sandboxBankService.getBanks() };
  }

  @Post('sandbox/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate and save sandbox cards for a bank' })
  async sandboxSync(
    @CurrentUserId() userId: string,
    @Body() body: { bank_id: string },
  ) {
    if (!body.bank_id) {
      return { ok: false, message: 'bank_id krävs', created: 0 };
    }
    try {
      const cards = this.sandboxBankService.generateCards(body.bank_id);
      let created = 0;
      for (const c of cards) {
        try {
          await this.cardsService.createCard(userId, {
            card_type: c.cardType,
            card_name: c.cardName,
            bank_name: c.bankName,
            last_four: c.lastFour,
            balance: c.balance,
            credit_limit: c.creditLimit,
            available_credit: c.availableCredit,
            currency: c.currency,
            expiry_date: c.expiryDate,
            notes: `Sandbox: ${c.id}`,
          });
          created++;
        } catch {
          // skip individual card errors
        }
      }
      return { ok: true, created, total: cards.length, bank_name: cards[0]?.bankName };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? 'Kunde inte skapa sandbox-kort', created: 0 };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single card by ID' })
  @ApiResponse({ status: 200, description: 'Card retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async getCardById(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.cardsService.getCardById(userId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({ status: 201, description: 'Card created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createCard(
    @CurrentUserId() userId: string,
    @Body() createDto: CreateCardDto
  ) {
    return await this.cardsService.createCard(userId, createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a card' })
  @ApiResponse({ status: 200, description: 'Card updated successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async updateCard(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateCardDto
  ) {
    return await this.cardsService.updateCard(userId, id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({ status: 200, description: 'Card deleted successfully' })
  async deleteCard(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.cardsService.deleteCard(userId, id);
  }
}

