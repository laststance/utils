import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['node_modules', 'dist', '.next', 'storybook-static'],
    setupFiles: ['./vitest-setup.ts', '../../setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'clover'],
      reportsDirectory: './coverage',
      all: true,
      include: [
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'app/**/*.{ts,tsx}'
      ],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'node_modules',
        'dist',
        '.next',
        'storybook-static',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'vitest.config.ts',
        'vitest-setup.ts',
        '**/*.stories.{ts,tsx}',
        '**/*.story.{ts,tsx}',
        '**/*.mdx',
        '**/coverage/**',
        '**/*.d.ts',
        'tailwind.config.js',
        'next.config.js',
        '.storybook/**',
        'postcss.config.js',
        'components/ui/accordion.tsx',
        'components/ui/alert-dialog.tsx',
        'components/ui/alert.tsx',
        'components/ui/aspect-ratio.tsx',
        'components/ui/avatar.tsx',
        'components/ui/breadcrumb.tsx',
        'components/ui/calendar.tsx',
        'components/ui/carousel.tsx',
        'components/ui/chart.tsx',
        'components/ui/checkbox.tsx',
        'components/ui/collapsible.tsx',
        'components/ui/command.tsx',
        'components/ui/context-menu.tsx',
        'components/ui/dialog.tsx',
        'components/ui/drawer.tsx',
        'components/ui/dropdown-menu.tsx',
        'components/ui/form.tsx',
        'components/ui/hover-card.tsx',
        'components/ui/input-otp.tsx',
        'components/ui/input.tsx',
        'components/ui/label.tsx',
        'components/ui/menubar.tsx',
        'components/ui/navigation-menu.tsx',
        'components/ui/pagination.tsx',
        'components/ui/popover.tsx',
        'components/ui/progress.tsx',
        'components/ui/radio-group.tsx',
        'components/ui/resizable.tsx',
        'components/ui/scroll-area.tsx',
        'components/ui/select.tsx',
        'components/ui/separator.tsx',
        'components/ui/sheet.tsx',
        'components/ui/sidebar.tsx',
        'components/ui/skeleton.tsx',
        'components/ui/slider.tsx',
        'components/ui/sonner.tsx',
        'components/ui/switch.tsx',
        'components/ui/table.tsx',
        'components/ui/tabs.tsx',
        'components/ui/textarea.tsx',
        'components/ui/toggle-group.tsx',
        'components/ui/toggle.tsx',
        'components/ui/tooltip.tsx'
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85,
        perFile: false,
        'components/**/*.{ts,tsx}': {
          lines: 90,
          functions: 90,
          branches: 85,
          statements: 90
        },
        'hooks/**/*.{ts,tsx}': {
          lines: 95,
          functions: 95,
          branches: 90,
          statements: 95
        }
      },
      watermarks: {
        statements: [65, 80],
        functions: [65, 80],
        branches: [60, 75],
        lines: [65, 80]
      },
      reportOnFailure: true,
      skipFull: false,
      clean: true,
      cleanOnRerun: true
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
