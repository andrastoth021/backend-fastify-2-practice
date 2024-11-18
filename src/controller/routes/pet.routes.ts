import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { getPetByIdSchema, getPetsSchema, postPetsSchema } from "../pet.schemas";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

export const petRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // Endpoint prefix: /api/pets

  const appWithTypeProvider = app.withTypeProvider<JsonSchemaToTsProvider>();

  appWithTypeProvider.get(
    '/',
    { schema: getPetsSchema },
    async () => {
      const pets = await appWithTypeProvider.petService.getAll();
      return pets;
    })

  appWithTypeProvider.get(
    '/:id',
    { schema: getPetByIdSchema },
    async (request) => {
      const { id } = request.params;
      const pets = await appWithTypeProvider.petService.getById(id);
      return pets;
    })

  appWithTypeProvider.post(
    '/',
    { schema: postPetsSchema },
    async (request, reply) => {
      const { body: petToCreate } = request;

      const created = await appWithTypeProvider.petService.create(petToCreate);
      reply.status(201);
      return created;
    })
}