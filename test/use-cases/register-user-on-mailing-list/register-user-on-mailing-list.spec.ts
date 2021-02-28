import { UserData } from '@/use-cases/entities'
import { UserRepository } from '@/use-cases/register-user-on-mailing-list/ports'
import { RegisterUserOnMailingList } from '@/use-cases/register-user-on-mailing-list'
import { InMemoryUserRepository } from './repository'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const response = await usecase.registerUserOnMailingList({ name, email })
    const user = await repo.findUserByEmail('any@email.com')
    expect(user.name).toBe('any_name')
    expect(response.value.name).toBe('any_name')
  })

  test('should not add user to mailing list with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const invalidEmail = 'invalid_email'
    const error = (await usecase.registerUserOnMailingList({ name, email: invalidEmail })).value as Error
    const user = await repo.findUserByEmail('invalid_email')
    expect(user).toBeNull()
    expect(error.name).toEqual('InvalidEmailError')
    expect(error.message).toEqual(`Invalid email: ${invalidEmail}.`)
  })

  test('should not add user to mailing list with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const invalidName = 'O      '
    const email = 'any@email.com'
    const error = (await usecase.registerUserOnMailingList({ name: invalidName, email })).value as Error
    const user = await repo.findUserByEmail(email)
    expect(user).toBeNull()
    expect(error.name).toEqual('InvalidNameError')
    expect(error.message).toEqual(`Invalid name: ${invalidName}.`)
  })
})
