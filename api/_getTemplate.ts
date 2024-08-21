import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';

export default (filename) => {
    const pathHbs = path.join(process.cwd(), 'templates', filename);
    const template = fs.readFileSync(pathHbs, 'utf8');
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate;
}
