import { Seeder } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { User } from '../resources/users/entities/user.entity'
import { DataSource } from 'typeorm'

export default class CreateUsers implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
		const userRepository = dataSource.getRepository(User);

		const users = Array.from({length: 10}, () => ({
			id: faker.string.uuid(),
			username: faker.internet.username(), 
      email: faker.internet.email(),
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			phone: faker.phone.number({style: 'international'}),
			gender: faker.person.sex(),
			city: faker.location.city(),
			address: faker.location.streetAddress(),
			dateOfBirthday: faker.date.birthdate({mode: 'age', min: 16, max: 65})
		}))

		console.log('users', users)

		await userRepository.save(users)
  }
}