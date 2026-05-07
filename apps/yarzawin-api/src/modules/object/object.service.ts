import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config/dist/config.service'
import { DbService } from 'src/database/database.service'
import { ObjectEntity } from 'src/database/entities/ObjectEntity'
import { EntityManager } from 'typeorm'
import { GenS3UploadUrlDto, GenTempUploadUrlDto, GenUploadUrlDto } from './object.dto'
import { v4 as uuidV4 } from 'uuid'

@Injectable()
export class ObjectService {
  public client: S3Client
  public db: EntityManager

  constructor(
    private configService: ConfigService,
    private dbService: DbService,
  ) {
    this.client = this.getS3Client()
    this.db = this.dbService.getEm()
  }

  async genTempUploadUrl(args: GenTempUploadUrlDto) {
    const key = uuidV4()
    const uploadUrl = await this.genS3UploadUrl({ key, ...args })

    return { url: uploadUrl, key }
  }

  async genUploadUrl(args: GenUploadUrlDto) {
    const object = await this.db.save(ObjectEntity, args)
    const uploadUrl = await this.genS3UploadUrl({ key: object.id, ...args })

    return { url: uploadUrl, key: object.id }
  }

  private async genS3UploadUrl({ key, userId, filename, mimeType }: GenS3UploadUrlDto) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: key,
      Metadata: {
        userId,
        filename,
      },
      ContentType: mimeType,
    })

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: 60 * 5,
    })
    return uploadUrl
  }

  private getS3Client() {
    return new S3Client({
      region: 'auto',
      endpoint: this.configService.get('S3_ENDPOINT')!,
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY')!,
      },
    })
  }
}
