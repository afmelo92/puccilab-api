import { readFile } from 'fs/promises';
import handlebars from 'handlebars';

type TemplateVariablesProps = {
  [key: string]: string | number;
};

export type ParseMailTemplateProps = {
  file: string;
  variables: TemplateVariablesProps;
};

class HandlebarsTemplateProvider {
  public async parse({ file, variables }: ParseMailTemplateProps) {
    const templateFileContent = await readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export default new HandlebarsTemplateProvider();
