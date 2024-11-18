import fastify from 'fastify';
import { PetService } from '../service/pet.service';
import { PetRepository } from '../repository/pet.repository';
import { DbClient } from '../db';
import { OwnerRepository } from '../repository/owner.repository';
import { OwnerService } from '../service/owner.service';
import { petRoutes } from './routes/pet.routes';
import { ownerRoutes } from './routes/owner.routes';
import { PetNotFoundError } from '../exceptions/PetNotFoundError';
import { httpErrors } from '@fastify/sensible';
import { OwnerNotFoundError } from '../exceptions/OwnerNotFoundError';
import { PetAlreadyAdoptedError } from '../exceptions/PetAlreadyAdoptedError';

declare module 'fastify' {
  interface FastifyInstance {
    petService: PetService,
    ownerService: OwnerService
  }
}

type Dependencies = {
  dbClient: DbClient;
}

export default function createApp(options = {}, dependencies: Dependencies) {
  const { dbClient } = dependencies;

  const petRepository = new PetRepository(dbClient);
  const petService = new PetService(petRepository);
  const ownerRepository = new OwnerRepository(dbClient);
  const ownerService = new OwnerService(ownerRepository);

  const app = fastify(options)

  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    if (error instanceof PetNotFoundError) {
      throw httpErrors.notFound(error.message);
    }
    else if (error instanceof OwnerNotFoundError) {
      throw httpErrors.notFound(error.message);
    }
    else if (error instanceof PetAlreadyAdoptedError) {
      throw httpErrors.conflict(error.message);
    }
    else {
      throw httpErrors.internalServerError(error.message);
    }
  });

  app.decorate('petService', petService);
  app.decorate('ownerService', ownerService);

  app.register(petRoutes, { prefix: "/api/pets" });
  app.register(ownerRoutes, { prefix: "/api/owners" });

  return app;
}