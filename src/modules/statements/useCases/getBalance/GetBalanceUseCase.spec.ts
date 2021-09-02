import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from './../createStatement/CreateStatementUseCase';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { GetBalanceError } from './GetBalanceError';

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get User Balance', () => {
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
  })

  it('should be able to get a user balance', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Test',
      email: 'user@test.com.br',
      password: '1234'
    });

    const statement = await createStatementUseCase.execute ({
      user_id: `${user.id}`,
      description: 'Statement test description',
      amount: 0,
      type: OperationType.WITHDRAW,
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id as string });

    expect(balance).toHaveProperty('balance')
  })

  it('should not be able to get a balance of an non-existent user', () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: '123456' });
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})
