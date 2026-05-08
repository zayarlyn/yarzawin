import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { PostService } from './post.service'
import { CreatePostDto, UpdatePostDto } from './post.dto'
import { AuthGuard } from 'src/guards/auth.guard'
import { Auth } from 'src/decorators/param.decorator'

@UseGuards(AuthGuard)
@Controller({ path: '/posts' })
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/')
  async getPosts(@Body('where') where: any, @Auth('userId') userId: string) {
    return this.postService.getPostList({ ...where, userId })
  }

  @Post('/')
  async createPost(@Body() data: CreatePostDto, @Auth('userId') userId: string) {
    return this.postService.createPost({ ...data, userId })
  }

  @Get('/:id')
  async getPost(@Param('id') id: string, @Auth('userId') userId: string) {
    const entries = await this.postService.getPostList({ id, userId })
    return entries[0] ?? null
  }

  @Put('/:id')
  async updatePost(@Param('id') id: string, @Body() data: UpdatePostDto, @Auth('userId') userId: string) {
    return this.postService.updatePost({ ...data, id, userId })
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: string, @Auth('userId') userId: string) {
    return this.postService.deletePost({ id, userId })
  }
}
