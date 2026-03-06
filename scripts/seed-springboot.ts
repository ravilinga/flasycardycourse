import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env file manually (no dotenv dependency needed)
const envPath = resolve(process.cwd(), ".env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  // .env not found, rely on existing env vars
}

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const SPRINGBOOT_CARDS = [
  {
    front: "What is Spring Boot?",
    back: "Spring Boot is an opinionated framework built on top of Spring that simplifies application setup by providing auto-configuration, embedded servers (Tomcat/Jetty), and starter dependencies — letting you run a Spring app with minimal boilerplate.",
  },
  {
    front: "What does @SpringBootApplication do?",
    back: "It's a convenience annotation that combines three annotations:\n• @Configuration – marks the class as a source of bean definitions\n• @EnableAutoConfiguration – enables Spring Boot's auto-config\n• @ComponentScan – scans the current package and sub-packages for components",
  },
  {
    front: "What is auto-configuration in Spring Boot?",
    back: "Auto-configuration automatically sets up Spring beans based on the JARs on the classpath and properties defined. For example, if H2 is on the classpath, Spring Boot auto-configures an in-memory datasource. You can override it with your own beans.",
  },
  {
    front: "What is a Spring Boot Starter?",
    back: "Starters are pre-packaged dependency descriptors that group related libraries. For example, spring-boot-starter-web pulls in Spring MVC, Jackson, and an embedded Tomcat — so you don't have to manage each dependency individually.",
  },
  {
    front: "What is the difference between @Component, @Service, @Repository, and @Controller?",
    back: "All four are stereotype annotations that register beans, but they convey intent:\n• @Component – generic bean\n• @Service – business logic layer\n• @Repository – data access layer (also translates DB exceptions)\n• @Controller – Spring MVC web layer",
  },
  {
    front: "What is @RestController?",
    back: "@RestController = @Controller + @ResponseBody. It marks a class as a web controller where every method returns data (JSON/XML) directly in the response body, rather than resolving a view template.",
  },
  {
    front: "What is the difference between @RequestMapping, @GetMapping, and @PostMapping?",
    back: "@RequestMapping is the generic annotation for mapping any HTTP method. @GetMapping and @PostMapping are shorthand composed annotations for GET and POST specifically. They improve readability and reduce boilerplate.",
  },
  {
    front: "How does Spring Boot handle application properties?",
    back: "Spring Boot reads configuration from application.properties or application.yml (in src/main/resources). You can inject values with @Value(\"${property.key}\") or bind a group of properties to a class with @ConfigurationProperties.",
  },
  {
    front: "What are Spring Profiles?",
    back: "Profiles let you define environment-specific configurations (dev, staging, prod). Activate a profile via spring.profiles.active=dev in properties, or with -Dspring.profiles.active=prod at runtime. Beans can be scoped to a profile with @Profile(\"dev\").",
  },
  {
    front: "What is Spring Data JPA?",
    back: "Spring Data JPA is an abstraction over JPA that eliminates boilerplate DAO code. By extending JpaRepository<Entity, ID> you get CRUD methods for free and can define queries via method naming conventions (e.g. findByLastName) or @Query.",
  },
  {
    front: "What is the difference between CrudRepository and JpaRepository?",
    back: "CrudRepository provides basic CRUD operations. JpaRepository extends PagingAndSortingRepository (which extends CrudRepository) and adds JPA-specific features like flushing the persistence context, batch deletes, and pagination/sorting support.",
  },
  {
    front: "What is @Transactional?",
    back: "@Transactional wraps a method (or class) in a database transaction. Spring creates a proxy around the bean; if the method throws an unchecked exception the transaction rolls back. It handles commit/rollback automatically.",
  },
  {
    front: "What is Dependency Injection (DI) in Spring?",
    back: "DI is a design pattern where an object receives its dependencies from an external source rather than creating them itself. Spring's IoC container manages object creation and wires dependencies — typically via constructor injection (preferred), setter injection, or field injection.",
  },
  {
    front: "What is the Spring IoC Container?",
    back: "The Inversion of Control (IoC) container is the core of Spring. It manages the lifecycle of beans — creating, configuring, assembling, and destroying them. ApplicationContext is the main IoC container interface, extending BeanFactory with extra features like events and AOP.",
  },
  {
    front: "What is a Spring Bean?",
    back: "A Spring Bean is any object managed by the Spring IoC container. Beans are created from configuration metadata (annotations, Java config, or XML) and can be injected into other beans. Default scope is singleton (one instance per container).",
  },
  {
    front: "What are the Spring Bean scopes?",
    back: "• singleton – one instance per Spring container (default)\n• prototype – new instance each time requested\n• request – one instance per HTTP request (web)\n• session – one instance per HTTP session (web)\n• application – one instance per ServletContext (web)\n• websocket – one per WebSocket session",
  },
  {
    front: "What is @Autowired?",
    back: "@Autowired instructs Spring to inject a dependency automatically by type. It can be placed on a constructor, setter, or field. Constructor injection is preferred because it makes dependencies explicit and supports immutability.",
  },
  {
    front: "What is the difference between @Bean and @Component?",
    back: "@Component is a class-level annotation that registers the class itself as a bean via component scanning. @Bean is a method-level annotation used inside @Configuration classes to explicitly declare and configure a bean — useful for third-party classes you can't annotate.",
  },
  {
    front: "What is Spring AOP?",
    back: "Aspect-Oriented Programming (AOP) lets you separate cross-cutting concerns (logging, security, transactions) from business logic. A Spring Aspect defines Advice (what to do) applied at a Pointcut (where/when). Spring uses JDK dynamic proxies or CGLIB under the hood.",
  },
  {
    front: "What is Spring Security?",
    back: "Spring Security is a framework for authentication and authorization in Spring applications. It provides out-of-the-box support for form login, HTTP Basic, OAuth2/JWT, method-level security (@PreAuthorize), CSRF protection, and more via a filter chain.",
  },
  {
    front: "What is an embedded server in Spring Boot?",
    back: "Spring Boot bundles an embedded servlet container (Tomcat by default, or Jetty/Undertow) inside the JAR. This means you run your app with java -jar app.jar without needing to deploy a WAR to an external server.",
  },
  {
    front: "How do you externalize configuration in Spring Boot?",
    back: "Spring Boot supports multiple configuration sources in priority order: command-line args > environment variables > application-{profile}.properties > application.properties. You can also use Spring Cloud Config for centralized config in microservices.",
  },
  {
    front: "What is Spring Boot Actuator?",
    back: "Actuator exposes production-ready endpoints for monitoring and management: /actuator/health, /actuator/metrics, /actuator/env, /actuator/info, etc. Add spring-boot-starter-actuator to enable. Endpoints can be secured and customized.",
  },
  {
    front: "What is the difference between @PathVariable and @RequestParam?",
    back: "@PathVariable extracts a value from the URI path: GET /users/{id} → @PathVariable Long id.\n@RequestParam extracts a query string parameter: GET /users?page=2 → @RequestParam int page.\nBoth can be made optional with required=false.",
  },
  {
    front: "What is @Entity in JPA?",
    back: "@Entity marks a Java class as a JPA entity — it maps to a database table. The class must have a no-arg constructor and a field annotated with @Id (primary key). By default, the table name matches the class name.",
  },
];

async function main() {
  // Try to find an existing userId in the DB to use for this seed
  const existingDecks = await db.select({ clerkUserId: schema.decks.clerkUserId }).from(schema.decks).limit(1);

  const userId = process.env.SEED_USER_ID ?? existingDecks[0]?.clerkUserId;

  if (!userId) {
    console.error(
      "No existing user found in the database.\n" +
      "Please provide your Clerk user ID:\n\n" +
      "  SEED_USER_ID=user_xxxxx npx tsx scripts/seed-springboot.ts\n"
    );
    process.exit(1);
  }

  console.log(`Seeding Spring Boot deck for userId: ${userId}`);

  const [deck] = await db
    .insert(schema.decks)
    .values({
      clerkUserId: userId,
      title: "Spring Boot Concepts",
      description: "Core Spring Boot and Spring Framework concepts for interview prep and self-study.",
    })
    .returning();

  console.log(`Created deck: "${deck.title}" (${deck.id})`);

  await db.insert(schema.cards).values(
    SPRINGBOOT_CARDS.map((card) => ({ deckId: deck.id, ...card }))
  );

  console.log(`Inserted ${SPRINGBOOT_CARDS.length} cards. Done!`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
