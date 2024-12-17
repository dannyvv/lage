import { PackageInfo, PackageInfos } from "workspace-tools";
import { getPackageTasks, InfoActionOptions } from "../src/commands/info/action";
import { Logger } from "@lage-run/logger";
import { ConfigOptions } from "@lage-run/config";

function stubPackage(name: string, deps: string[] = []) {
  return {
    name,
    packageJsonPath: `packages/${name}`,
    version: "1.0",
    dependencies: deps.reduce((depMap, dep) => ({ ...depMap, [dep]: "*" }), {}),
    devDependencies: {},
    scripts: { build: "__build__", codegen: "__codegen", lint: "__lint__" },
  } as PackageInfo;
}

describe("createTargetGraph", () => {
  const logger = new Logger();
  it("A basic target graph", async () => {
    const packageInfos: PackageInfos = {
      foo: stubPackage("foo"),
      bar: stubPackage("bar"),
    };

    const config = <ConfigOptions>(<any>{
      pipeline: {
        build: ["^build", "codegen"],
        codegen: [],
        lint: [],
      },
      cacheOptions: {},
    });

    const options: InfoActionOptions = {
      dependencies: false,
      dependents: false,
      since: "",
      scope: [],
      to: [],
      cache: false,
      nodeArg: "",
      ignore: [],
      server: "",
      reporter: "none",
      progress: false,
      verbose: false,
      grouped: false,
      concurrency: 1,
      logLevel: "verbose",
    };

    const packageTasks = await getPackageTasks(".", logger, options, config, packageInfos, ["build"]);

    expect(packageTasks).toEqual([]);
  });
});
