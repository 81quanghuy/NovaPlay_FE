/**
 * NovaPlay FE Unified Test Runner
 * High-performance test harness powered by esbuild and Node.js.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

// Parse CLI args
const args = process.argv.slice(2);
const tierArg = args.find((a) => a.startsWith('--tier='));
const targetTier = tierArg ? tierArg.split('=')[1] : null;
const filterArg = args.find((a) => !a.startsWith('--'));

function findTestFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findTestFiles(filePath));
    } else if (file.endsWith('.test.ts') || file.endsWith('.test.js')) {
      results.push(filePath);
    }
  }
  return results.sort();
}

async function runTestSuite() {
  const startTime = Date.now();
  console.log(`\n${colors.cyan}${colors.bright}========================================================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}           🎬  NOVAPLAY FE COMPREHENSIVE TEST SUITE RUNNER  🎬           ${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}========================================================================${colors.reset}\n`);

  const tiers = [
    { id: '1', name: 'Tier 1: Feature Coverage (F01 - F27)', dir: path.join(__dirname, 'tier1-features') },
    { id: '2', name: 'Tier 2: Boundary & Corner Cases', dir: path.join(__dirname, 'tier2-boundary-corner') },
    { id: '3', name: 'Tier 3: Cross-Feature Integration', dir: path.join(__dirname, 'tier3-cross-feature') },
    { id: '4', name: 'Tier 4: Real-World Scenarios', dir: path.join(__dirname, 'tier4-real-world-scenarios') },
  ];

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  const tierStats = {};

  for (const tier of tiers) {
    if (targetTier && targetTier !== tier.id) continue;

    console.log(`\n${colors.magenta}${colors.bright}▶ ${tier.name}${colors.reset}`);
    console.log(`${colors.dim}------------------------------------------------------------------------${colors.reset}`);

    const files = findTestFiles(tier.dir);
    let tierPassCount = 0;
    let tierFailCount = 0;

    for (const testFilePath of files) {
      const relPath = path.relative(projectRoot, testFilePath);
      if (filterArg && !relPath.includes(filterArg)) continue;

      const fileStartTime = Date.now();

      try {
        const buildResult = esbuild.buildSync({
          entryPoints: [testFilePath],
          bundle: true,
          format: 'cjs',
          platform: 'node',
          target: 'node20',
          alias: {
            '@': path.resolve(projectRoot, 'src'),
          },
          define: {
            'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:8072/api/v1'),
            'import.meta.env.VITE_AUTH_BYPASS': JSON.stringify('false'),
            'import.meta.env.VITE_APP_ENV': JSON.stringify('test'),
            'import.meta.env.MODE': JSON.stringify('test'),
            'import.meta.env.DEV': JSON.stringify(true),
            'import.meta.env.PROD': JSON.stringify(false),
            'import.meta.env': JSON.stringify({
              VITE_API_URL: 'http://localhost:8072/api/v1',
              VITE_AUTH_BYPASS: 'false',
              VITE_APP_ENV: 'test',
              MODE: 'test',
              DEV: true,
              PROD: false,
            }),
          },
          write: false,
          sourcemap: 'inline',
        });

        const bundledCode = buildResult.outputFiles[0].text;

        // Reset global test suite registry before running file
        globalThis.__TEST_SUITES__ = [];

        // Execute bundled code
        const moduleExports = {};
        const runModule = new Function(
          'exports',
          'require',
          'module',
          '__filename',
          '__dirname',
          'globalThis',
          bundledCode
        );

        runModule(
          moduleExports,
          (id) => {
            return {};
          },
          { exports: moduleExports },
          testFilePath,
          path.dirname(testFilePath),
          globalThis
        );

        // Retrieve registered suites
        const suites = [...(globalThis.__TEST_SUITES__ || [])];
        globalThis.__TEST_SUITES__ = [];

        let filePassed = 0;
        let fileFailed = 0;

        for (const suite of suites) {
          for (const hook of suite.beforeAllHooks) await hook();

          for (const testCase of suite.tests) {
            totalTests++;
            const tStart = Date.now();
            let testPassed = true;
            let testError = null;

            try {
              for (const hook of suite.beforeEachHooks) await hook();
              await testCase.fn();
              for (const hook of suite.afterEachHooks) await hook();
            } catch (err) {
              testPassed = false;
              testError = err;
            }

            const tDuration = Date.now() - tStart;

            if (testPassed) {
              totalPassed++;
              filePassed++;
              tierPassCount++;
              console.log(`  ${colors.green}✔${colors.reset} ${colors.dim}${suite.name} >${colors.reset} ${testCase.name} ${colors.dim}(${tDuration}ms)${colors.reset}`);
            } else {
              totalFailed++;
              fileFailed++;
              tierFailCount++;
              console.log(`  ${colors.red}✖${colors.reset} ${colors.bright}${suite.name} > ${testCase.name}${colors.reset} ${colors.dim}(${tDuration}ms)${colors.reset}`);
              console.log(`    ${colors.red}Error: ${testError?.message || testError}${colors.reset}`);
              if (testError?.stack) {
                const stackLine = testError.stack.split('\n').slice(1, 3).join('\n    ');
                console.log(`    ${colors.dim}${stackLine}${colors.reset}`);
              }
            }
          }

          for (const hook of suite.afterAllHooks) await hook();
        }

        const fileDuration = Date.now() - fileStartTime;
        if (fileFailed === 0 && filePassed > 0) {
          console.log(`  ${colors.green}↳ ${path.basename(testFilePath)} passed (${filePassed} tests, ${fileDuration}ms)${colors.reset}\n`);
        } else if (fileFailed > 0) {
          console.log(`  ${colors.red}↳ ${path.basename(testFilePath)} had ${fileFailed} failures (${fileDuration}ms)${colors.reset}\n`);
        }
      } catch (bundleErr) {
        console.log(`  ${colors.red}✖ Bundle/Execution Error in ${relPath}:${colors.reset}`);
        console.log(`    ${colors.red}${bundleErr.message || bundleErr}${colors.reset}\n`);
        totalFailed++;
        tierFailCount++;
      }
    }

    tierStats[tier.name] = { passed: tierPassCount, failed: tierFailCount, total: tierPassCount + tierFailCount };
  }

  const totalDuration = Date.now() - startTime;

  console.log(`\n${colors.cyan}${colors.bright}========================================================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}                       TEST EXECUTION SUMMARY                           ${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}========================================================================${colors.reset}\n`);

  for (const [tierName, stats] of Object.entries(tierStats)) {
    const statusIcon = stats.failed === 0 && (stats.passed > 0 || stats.total === 0) ? `${colors.green}✔ PASS${colors.reset}` : `${colors.red}✖ FAIL${colors.reset}`;
    console.log(`  ${statusIcon} ${colors.bright}${tierName.padEnd(45)}${colors.reset} : ${colors.green}${stats.passed} passed${colors.reset}, ${stats.failed > 0 ? colors.red + stats.failed + ' failed' : colors.dim + '0 failed' + colors.reset}`);
  }

  console.log(`\n${colors.dim}------------------------------------------------------------------------${colors.reset}`);
  console.log(`  ${colors.bright}Total Tests Executed :${colors.reset} ${totalTests}`);
  console.log(`  ${colors.green}${colors.bright}Total Tests Passed   :${colors.reset} ${totalPassed}`);
  console.log(`  ${totalFailed > 0 ? colors.red + colors.bright : colors.dim}Total Tests Failed   :${colors.reset} ${totalFailed}`);
  console.log(`  ${colors.bright}Total Execution Time :${colors.reset} ${totalDuration}ms`);
  console.log(`${colors.cyan}${colors.bright}========================================================================${colors.reset}\n`);

  if (totalFailed > 0) {
    console.log(`${colors.bgRed}${colors.bright} ✖ TEST SUITE FAILED (${totalFailed} failures) ${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.bgGreen}${colors.bright} ✔ ALL TESTS PASSED SUCCESSFULLY (100% SUCCESS) ${colors.reset}\n`);
    process.exit(0);
  }
}

runTestSuite().catch((e) => {
  console.error('Fatal Runner Error:', e);
  process.exit(1);
});
