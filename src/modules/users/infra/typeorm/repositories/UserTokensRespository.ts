import { getRepository, Repository } from 'typeorm'
import { ICreateUserToken } from '@modules/users/dtos/ICreateUserToken'
import { UserTokens } from '../entities/UserTokens'
import { IUserTokensRepository } from '@modules/users/repositories/IUserTokensRepository'

class UserTokensRepository implements IUserTokensRepository {
  private repository: Repository<UserTokens>

  constructor() {
    this.repository = getRepository(UserTokens)
  }

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserToken): Promise<UserTokens> {
    const userToken = this.repository.create({
      user_id,
      expires_date,
      refresh_token,
    })

    await this.repository.save(userToken)
    return userToken
  }

  async findByUserIdAndRefreshTokens(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const userTokens = await this.repository.findOneOrFail({
      user_id,
      refresh_token,
    })
    return userTokens
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}

export { UserTokensRepository }
