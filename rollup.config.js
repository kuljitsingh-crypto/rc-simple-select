import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import sourcemaps from "rollup-plugin-sourcemaps";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import copy from "rollup-plugin-copy";
import postcss from "rollup-plugin-postcss";
import babel from "@rollup/plugin-babel";

const packageJson = require("./package.json");

export default function (arg) {
  const { watch } = arg;
  const isEnvDevelopment = watch;
  const isEnvProduction = !watch;
  console.log(arg, isEnvDevelopment, isEnvProduction);

  const inputPath = isEnvProduction
    ? "src/index.ts"
    : isEnvDevelopment && "dev/index.tsx";
  const watchConfigmaybe = isEnvProduction
    ? {}
    : {
        watch: {
          clearScreen: false, // Don't clear the console on rebuild
        },
      };

  const extrnalMaybe = isEnvProduction
    ? { external: ["react", "react-dom"] }
    : {};

  const getPlugins = () => {
    const plugins = [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss(),
      isEnvDevelopment && sourcemaps(), // Source maps only in development
      isEnvProduction && terser(), // Minify for production
      isEnvDevelopment &&
        serve({
          open: true, // Open browser after starting server
          contentBase: ["dist"], // Serve files from 'dist'
          port: 3001, // Port for the server
        }),
      isEnvDevelopment &&
        livereload({
          watch: "dist", // Watch the 'dist' folder for live reload
        }),
      isEnvDevelopment &&
        copy({
          targets: [
            { src: "dev/index.html", dest: "dist" }, // Copy index.html to dist
          ],
          verbose: true, // Optional: Logs the copy operation
        }),
      isEnvDevelopment &&
        babel({
          presets: ["@babel/preset-react"],
        }),
    ].filter(Boolean);
    return plugins;
  };
  return [
    {
      input: inputPath,
      output: [
        {
          file: packageJson.main,
          format: "cjs",
          sourcemap: true,
          name: packageJson.name,
        },
        {
          file: packageJson.module,
          format: "esm",
          sourcemap: true,
        },
      ],
      plugins: getPlugins(),
      ...extrnalMaybe,
      ...watchConfigmaybe,
    },
    {
      input: inputPath,
      output: [{ file: packageJson.types }],
      plugins: [dts.default()],
      external: [/\.css$/],
    },
  ];
}
