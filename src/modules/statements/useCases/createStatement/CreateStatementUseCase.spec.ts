import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';

let createStatementUseCase: CreateStatementUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create Car', () => {
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }


  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it('should be able to create a new statement', async () => {

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


    expect(statement).toHaveProperty('id')
  });



  it('should not be able to create a new statement for a non-existent user', () => {
    expect(async () => {

    await createStatementUseCase.execute ({
        user_id: '123456',
        description: 'Statement test description',
        amount: 0,
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to create a new statement if the user has an invalid balance', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'User Test',
        email: 'user@test.com.br',
        password: '1234'
      });

      const statement = await createStatementUseCase.execute ({
        user_id: `${user.id}`,
        description: 'Statement test description',
        amount: 3500,
        type: OperationType.WITHDRAW,
      });

      return statement;
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
})
