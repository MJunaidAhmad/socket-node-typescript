import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { TraceExporter } from "@google-cloud/opentelemetry-cloud-trace-exporter";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { CloudPropagator } from "@google-cloud/opentelemetry-cloud-trace-propagator";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { FastifyInstrumentation } from "@opentelemetry/instrumentation-fastify";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { LOGGING_SPAN_KEY, LOGGING_TRACE_KEY } from "@google-cloud/logging-winston";
import { gcpProjectId } from "./config";

export function initTracing() {
  console.log("Initializing tracing");
}

const provider = new NodeTracerProvider({
  // We should use envDetector to set it, but we can't due to
  // https://github.com/open-telemetry/opentelemetry-js/issues/2912
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "events-notifications-api",
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: "events",
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version as string,
  }),
});

const traceExporter = new TraceExporter({
  // Will export all resource attributes that start with "service."
  // https://github.com/GoogleCloudPlatform/opentelemetry-operations-js/blob/main/packages/opentelemetry-cloud-trace-exporter/README.md#resource-attributes
  resourceFilter: /^service\./,
});

// Configure the span processor to send spans to the exporter
provider.addSpanProcessor(new BatchSpanProcessor(traceExporter));

provider.register({
  propagator: new CloudPropagator(),
});

registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
    new HttpInstrumentation(),
    new FastifyInstrumentation(),
    new WinstonInstrumentation({
      logHook: (span, record) => {
        // https://cloud.google.com/trace/docs/trace-log-integration
        record[LOGGING_TRACE_KEY] = `projects/${gcpProjectId}/traces/${record["trace_id"]}`;
        delete record["trace_id"];

        record[LOGGING_SPAN_KEY] = record["span_id"];
        delete record["span_id"];

        delete record["trace_flags"];
      },
    }),
  ],
});

export async function shutdownTracing() {
  await traceExporter.shutdown();
}
