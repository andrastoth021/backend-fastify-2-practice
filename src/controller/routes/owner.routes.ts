import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { putPetsToOwnersSchema } from "../pet.schemas";
import { getOwnerByIdSchema, getOwnersSchema, postOwnerSchema } from "../owner.schemas";

export const ownerRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // Endpoint prefix: /api/owners

  const appWithTypeProvider = app.withTypeProvider<JsonSchemaToTsProvider>();

  appWithTypeProvider.put(
    '/:ownerId/pets/:petId',
    { schema: putPetsToOwnersSchema },
    async (request) => {
      const { petId, ownerId } = request.params;
      
      // Check if owner even exists.
      // Must have, otherwise if we provide a non-existent owner's id, the 'ownerNotFound' error is not handled.
      // Instead we receive a 500 Internal Server Error with an SQL error message.
      await appWithTypeProvider.ownerService.getById(ownerId);
      
      const updated = await appWithTypeProvider.petService.adopt(petId, ownerId);
      return updated;
    }
  )

  appWithTypeProvider.get(
    '/',
    { schema: getOwnersSchema },
    async () => {
      return await appWithTypeProvider.ownerService.getAll();
    }
  )

  appWithTypeProvider.get(
    '/:id',
    { schema: getOwnerByIdSchema },
    async (request) => {
      const { id } = request.params;
      return await appWithTypeProvider.ownerService.getById(id);
    }
  )

  appWithTypeProvider.post(
    '/',
    { schema: postOwnerSchema },
    async (request, reply) => {
      const ownerProps = request.body;
      const created = await appWithTypeProvider.ownerService.create(ownerProps);
      reply.status(201);
      return created;
    }
  )
}