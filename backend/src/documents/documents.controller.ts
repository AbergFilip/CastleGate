import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';

@ApiTags('Documents')
@Controller('documents')
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all documents for current user' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  async getDocuments(
    @CurrentUserId() userId: string,
    @Query() query: QueryDocumentsDto
  ) {
    return await this.documentsService.getDocuments(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single document by ID' })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocumentById(
    @CurrentUserId() userId: string,
    @Param('id') id: string
  ) {
    return await this.documentsService.getDocumentById(userId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createDocument(
    @CurrentUserId() userId: string,
    @Body() createDto: CreateDocumentDto
  ) {
    return await this.documentsService.createDocument(userId, createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a document' })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async updateDocument(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateDocumentDto
  ) {
    return await this.documentsService.updateDocument(userId, id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  async deleteDocument(
    @CurrentUserId() userId: string,
    @Param('id') id: string
  ) {
    return await this.documentsService.deleteDocument(userId, id);
  }
}

