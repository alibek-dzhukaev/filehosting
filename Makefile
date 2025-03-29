.PHONY: up down restart logs clean build migrate migrate-generate

include ./.env.development

COMPOSE_FILES := -f docker/docker-compose/base.yaml \
                 -f docker/docker-compose/postgres.yaml \
                 -f docker/docker-compose/redis.yaml \
                 -f docker/docker-compose/kafka.yaml \
                 -f docker/docker-compose/kafka-ui.yaml \
                 -f docker/docker-compose/node.yaml \
                 -f docker/docker-compose/nginx.yaml \
                 -f docker-compose.override.yml

up:
	docker-compose $(COMPOSE_FILES) up

down:
	docker-compose $(COMPOSE_FILES) down

build:
	docker-compose $(COMPOSE_FILES) build

restart:
	docker-compose $(COMPOSE_FILES) restart

logs:
	docker-compose $(COMPOSE_FILES) logs -f

clean: down
	docker volume rm docker_postgres_data docker_redis_data
	docker system prune -f

ps:
	docker-compose $(COMPOSE_FILES) ps

# Run database migrations
migrate:
	docker-compose $(COMPOSE_FILES) exec node pnpm migration:run

# Generate new migration file
# Usage: make migrate-generate name=MigrationName
migrate-generate:
ifndef name
	$(error Please specify migration name with name= parameter)
endif
	docker-compose $(COMPOSE_FILES) exec node pnpm migration:generate $(name)
