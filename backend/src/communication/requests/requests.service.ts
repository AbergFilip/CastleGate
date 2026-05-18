import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateResponseDto } from './dto/create-response.dto';

export interface Request {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  status?: string;
  responses_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface RequestResponse {
  id: string;
  request_id: string;
  responder_id?: string;
  responder_name: string;
  responder_type?: string;
  message?: string;
  price?: string;
  contact_info?: any;
  created_at: Date;
}

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getRequests() {
    try {
      // Get all requests
      const { data: requests, error: requestsError } = await this.supabaseService
        .getClient()
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) {
        this.logger.error(`Error fetching requests: ${requestsError.message}`);
        throw new Error('Could not fetch requests');
      }

      // Get all responses
      const { data: responses, error: responsesError } = await this.supabaseService
        .getClient()
        .from('request_responses')
        .select('*');

      if (responsesError) {
        this.logger.error(`Error fetching responses: ${responsesError.message}`);
        throw new Error('Could not fetch responses');
      }

      // Combine requests with responses
      const requestsWithResponses = (requests || []).map((request: any) => ({
        ...request,
        request_responses: (responses || []).filter(
          (r: any) => r.request_id === request.id
        ),
      }));

      return requestsWithResponses;
    } catch (error: any) {
      this.logger.error(`Error fetching requests: ${error.message}`);
      throw new Error('Could not fetch requests');
    }
  }

  async getMyRequests(userId: string) {
    try {
      // Get user's requests
      const { data: requests, error: requestsError } = await this.supabaseService
        .getClient()
        .from('requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (requestsError) {
        this.logger.error(`Error fetching my requests: ${requestsError.message}`);
        throw new Error('Could not fetch requests');
      }

      // Get responses for these requests
      const requestIds = (requests || []).map((r: any) => r.id);
      const { data: responses, error: responsesError } = await this.supabaseService
        .getClient()
        .from('request_responses')
        .select('*')
        .in('request_id', requestIds);

      if (responsesError) {
        this.logger.error(`Error fetching responses: ${responsesError.message}`);
        throw new Error('Could not fetch responses');
      }

      // Combine requests with responses
      const requestsWithResponses = (requests || []).map((request: any) => ({
        ...request,
        request_responses: (responses || []).filter(
          (r: any) => r.request_id === request.id
        ),
      }));

      return requestsWithResponses;
    } catch (error: any) {
      this.logger.error(`Error fetching my requests: ${error.message}`);
      throw new Error('Could not fetch requests');
    }
  }

  async getRequestById(id: string) {
    try {
      // Get request
      const { data: request, error: requestError } = await this.supabaseService
        .getClient()
        .from('requests')
        .select('*')
        .eq('id', id)
        .single();

      if (requestError || !request) {
        throw new NotFoundException('Request not found');
      }

      // Get responses
      const { data: responses, error: responsesError } = await this.supabaseService
        .getClient()
        .from('request_responses')
        .select('*')
        .eq('request_id', id);

      if (responsesError) {
        this.logger.error(`Error fetching responses: ${responsesError.message}`);
        throw new Error('Could not fetch responses');
      }

      return {
        ...request,
        request_responses: responses || [],
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching request: ${error.message}`);
      throw new Error('Could not fetch request');
    }
  }

  async createRequest(userId: string, createDto: CreateRequestDto) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('requests')
        .insert({
          user_id: userId,
          title: createDto.title,
          description: createDto.description || null,
          category: createDto.category || null,
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating request: ${error.message}`);
        throw new Error('Could not create request');
      }

      return data;
    } catch (error: any) {
      this.logger.error(`Error creating request: ${error.message}`);
      throw new Error('Could not create request');
    }
  }

  async createResponse(userId: string, requestId: string, createDto: CreateResponseDto) {
    try {
      // Get responder details
      const { data: userData } = await this.supabaseService
        .getClient()
        .from('users')
        .select('name, user_type')
        .eq('id', userId)
        .single();

      const responderName = userData?.name || 'Unknown';
      const responderType = userData?.user_type === 'B2B' ? 'company' : 'user';

      // Create response
      const { data, error } = await this.supabaseService
        .getClient()
        .from('request_responses')
        .insert({
          request_id: requestId,
          responder_id: userId,
          responder_name: responderName,
          responder_type: responderType,
          message: createDto.message || null,
          price: createDto.price || null,
          contact_info: createDto.contactInfo || null,
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating response: ${error.message}`);
        throw new Error('Could not create response');
      }

      // Increment response count
      const { data: currentRequest } = await this.supabaseService
        .getClient()
        .from('requests')
        .select('responses_count')
        .eq('id', requestId)
        .single();

      await this.supabaseService
        .getClient()
        .from('requests')
        .update({
          responses_count: (currentRequest?.responses_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      return data;
    } catch (error: any) {
      this.logger.error(`Error creating response: ${error.message}`);
      throw new Error('Could not create response');
    }
  }
}
