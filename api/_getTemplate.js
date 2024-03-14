import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';

export default (filename) => {
    const pathHbs = path.join(process.cwd(), 'templates', filename);
    const footerHbs = path.join(process.cwd(), 'templates', 'footer.hbs');
    const headerHbs = path.join(process.cwd(), 'templates', 'header.hbs');
    const template = fs.readFileSync(pathHbs, 'utf8');
    const footer = fs.readFileSync(footerHbs, 'utf8');
    const header = fs.readFileSync(headerHbs, 'utf8');

    Handlebars.registerPartial('footer', footer);
    Handlebars.registerPartial('header', header);

    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate;
}
