import { PutObjectCommand, S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'

export const s3Client = new S3Client({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  forcePathStyle: false,
  region: 'nyc3',
  credentials: {
    accessKeyId: useRuntimeConfig().S3_CLIENT_KEY,
    secretAccessKey: useRuntimeConfig().S3_SECRET_KEY,
  },
})

export const paramsValidator = z.object({
  Key: z.string(),
  ACL: z.union([z.literal('public-read'), z.literal('private')]),
  Body: z.any(),
  Metadata: z.any(),
})

export const getS3Params = ({
  Key,
  ACL = 'public-read',
  Body = '',
  Metadata = {},
}: {
  Key: string
  ACL: 'public-read' | 'private'
  Body?: any
  Metadata?: Record<string, string>
}) => {
  return {
    Bucket: 'object', // The path to the directory you want to upload the object to, starting with your Space name.
    Key,
    Body,
    ACL,
    Metadata,
  }
}

export const putObject = async (params: ReturnType<typeof getS3Params>) => {
  const data = await s3Client.send(new PutObjectCommand(params))
  console.log('Successfully uploaded object: ' + params.Bucket + '/' + params.Key)
  return data
}

export const deleteObject = async (key: string) => {
  const data = await s3Client.send(new DeleteObjectCommand({ Bucket: 'object', Key: key }))
  console.log('Successfully uploaded object: ' + key)
  return data
}

export const getObject = async (params: ReturnType<typeof getS3Params>) => {
  const data = await s3Client.send(new GetObjectCommand(params))
  console.log('Successfully uploaded object: ' + params.Bucket + '/' + params.Key)
  return data
}

export const getPresignedPutUrl = async (key: string) => {
  const url = await getSignedUrl(s3Client, new PutObjectCommand({ Key: key, Bucket: 'object', ACL: 'public-read' }), {
    expiresIn: 3600,
  })
  return url
}

export const getPresignedGetUrl = async (key: string) => {
  const url = await getSignedUrl(s3Client, new GetObjectCommand({ Key: key, Bucket: 'object' }), {
    expiresIn: 3600,
  })
  return url
}
