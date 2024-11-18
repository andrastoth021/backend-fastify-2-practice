import { PetToCreate } from "../entity/pet.type";
import { PetAlreadyAdoptedError } from "../exceptions/PetAlreadyAdoptedError";
import { PetNotFoundError } from "../exceptions/PetNotFoundError";
import { PetRepository } from "../repository/pet.repository"

export class PetService {
  private readonly repository;

  constructor(repository: PetRepository) {
    this.repository = repository;
  }

  async getAll() {
    return await this.repository.read();
  }

  async getById(id: number) {
    const pet = await this.repository.readById(id);
    if(!pet) {
      throw new PetNotFoundError('Pet does not exists.');
    }
    return pet;
  }

  async create(pet: PetToCreate) {
    return await this.repository.create(pet);
  }

  async adopt(petId: number, ownerId: number) {
    const pet = await this.repository.readById(petId);
    if (!pet) {
      throw new PetNotFoundError('Pet does not exists.');
    }
    if(pet.ownerId !== null) {
      throw new PetAlreadyAdoptedError('Pet has already have an owner.')
    }
    const adopted = await this.repository.update(petId, { ownerId })
    if (!adopted) {
      throw new PetNotFoundError('Pet could not be adopted, because it is disappeared.');
    }
    return adopted;
  }
}