import { Module, OnModuleInit, Provider } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

// 3) Render with data

export const HBS = 'HBS';

export interface IHbs {
  generateHtml<T>(form: { templateName: string; data: T }): string;
}

export const HbsProvider: Provider<IHbs> = {
  provide: HBS,
  useValue: {
    generateHtml: <T>(form: { templateName: string; data: T }) => {
      // Defensive checks help surface the *real* problem fast
      if (!form || typeof form !== 'object') {
        throw new Error(`Hbs.generateHtml expected { templateName, data }, got: ${typeof form}`);
      }
      if (!form.templateName) {
        throw new Error(`Hbs.generateHtml missing 'templateName'`);
      }

      // Use __dirname so it works regardless of cwd
      const templatePath = path.join(__dirname, 'templates', `${form.templateName}.handlebars`);
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found at ${templatePath}`);
      }

      const tplSource = fs.readFileSync(templatePath, 'utf8');

      const template = Handlebars.compile(tplSource);

      return template(form.data);
    },
  },
};

@Module({
  providers: [HbsProvider],
  exports: [HbsProvider],
})
export class HbsModule implements OnModuleInit {
  onModuleInit() {
    Handlebars.registerHelper('formatDate', (date: string | number | Date, format?: string) => {
      const d = new Date(date);

      if (!format) {
        return d.toISOString().replace('T', ' ').slice(0, 16);
      }

      if (format === 'YYYY-MM-DD HH:mm') {
        return d.toISOString().replace('T', ' ').slice(0, 16);
      }
      return d.toISOString().replace('T', ' ').slice(0, 16);
    });
  }
}
