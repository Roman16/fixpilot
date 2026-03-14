import mongoose, {Schema, Document} from 'mongoose';

export interface IServiceTemplateDocument extends Document {
    userId: mongoose.Types.ObjectId;
    works: { name: string; price?: number }[];
    materials: { name: string; price?: number }[];
    packages: {
        name: string;
        works: { name: string; price?: number }[];
        materials: { name: string; count?: number; price?: number }[];
    }[];
}

const DEFAULT_WORKS = [
    {name: 'Заміна моторного масла', price: 300},
    {name: 'Заміна масляного фільтра', price: 200},
    {name: 'Заміна повітряного фільтра', price: 500},
    {name: 'Заміна свічок запалювання', price: 500},
    {name: 'Регулювання клапанів', price: 2600},
    {name: 'Перевірка та регулювання ланцюга', price: 250},
    {name: 'Перевірка гальм', price: 200},
    {name: 'Чищення карбюратора', price: 600},
    {name: 'Заміна ланцюгової передачі (комплект)', price: 800},
    {name: 'Обслуговування вилки (заміна масла + сальники)', price: 1200},
    {name: 'Регулювання холостого ходу', price: 150},
    {name: 'Комп\'ютерна діагностика', price: 350},
    {name: 'Заміна акумулятора', price: 200},
    {name: 'Ремонт освітлення / заміна ламп', price: 200},
    {name: 'Перевірка та ремонт проводки', price: 300},
    {name: 'Заміна шин (2 колеса)', price: 600},
    {name: 'Балансування коліс', price: 200},
    {name: 'Ремонт проколу', price: 400},
    {name: 'Заміна гальмівних колодок (перед + зад)', price: 450},
    {name: 'Прокачка гальм', price: 200},
];

const DEFAULT_MATERIALS = [
    {name: 'Моторне масло 10W-40 (1л)', price: 350},
    {name: 'Гальмівна рідина DOT 4 (0.5л)', price: 180},
    {name: 'Мастило для ланцюга', price: 180},
    {name: 'Масло для вилки (1л)', price: 220},
    {name: 'Масляний фільтр', price: 180},
    {name: 'Повітряний фільтр', price: 750},
    {name: 'Гальмівні колодки передні', price: 450},
    {name: 'Гальмівні колодки задні', price: 350},
    {name: 'Гальмівний диск передній', price: 900},
    {name: 'Свічки запалювання (шт)', price: 320},
    {name: 'Ланцюг приводний', price: 2900},
    {name: 'Зірочка передня', price: 350},
    {name: 'Зірочка задня', price: 550},
    {name: 'Сальники вилки (комплект)', price: 780},
    {name: 'Акумулятор', price: 2800},
    {name: 'Лампа фари', price: 450},
];

const DEFAULT_PACKAGES = [
    {
        name: 'ТО базове',
        works: [
            {name: 'Заміна моторного масла', price: 200},
            {name: 'Заміна масляного фільтра', price: 100},
            {name: 'Перевірка гальм', price: 100},
        ],
        materials: [
            {name: 'Моторне масло 10W-40 (1л)', count: 2, price: 350},
            {name: 'Масляний фільтр', count: 1, price: 180},
        ],
    },
    {
        name: 'ТО повне',
        works: [
            {name: 'Заміна моторного масла', price: 200},
            {name: 'Заміна масляного фільтра', price: 100},
            {name: 'Заміна повітряного фільтра', price: 120},
            {name: 'Заміна свічок запалювання', price: 150},
            {name: 'Регулювання клапанів', price: 600},
            {name: 'Перевірка та регулювання ланцюга', price: 150},
            {name: 'Перевірка гальм', price: 100},
        ],
        materials: [
            {name: 'Моторне масло 10W-40 (1л)', count: 2, price: 350},
            {name: 'Масляний фільтр', count: 1, price: 180},
            {name: 'Повітряний фільтр', count: 1, price: 250},
            {name: 'Свічки запалювання (шт)', count: 2, price: 120},
            {name: 'Мастило для ланцюга', count: 1, price: 180},
        ],
    },
    {
        name: 'Підготовка до сезону',
        works: [
            {name: 'Загальний огляд мотоцикла', price: 300},
            {name: 'Заміна моторного масла', price: 200},
            {name: 'Перевірка та регулювання ланцюга', price: 150},
            {name: 'Перевірка гальм', price: 100},
            {name: 'Комп\'ютерна діагностика', price: 350},
        ],
        materials: [
            {name: 'Моторне масло 10W-40 (1л)', count: 2, price: 350},
            {name: 'Масляний фільтр', count: 1, price: 180},
        ],
    },
    {
        name: 'Заміна гальмівних колодок',
        works: [
            {name: 'Заміна гальмівних колодок (перед + зад)', price: 450},
            {name: 'Прокачка гальм', price: 200},
        ],
        materials: [
            {name: 'Гальмівні колодки передні', count: 1, price: 450},
            {name: 'Гальмівні колодки задні', count: 1, price: 350},
            {name: 'Гальмівна рідина DOT 4 (0.5л)', count: 1, price: 180},
        ],
    },
    {
        name: 'Заміна ланцюгової передачі',
        works: [
            {name: 'Заміна ланцюгової передачі (комплект)', price: 800},
        ],
        materials: [
            {name: 'Ланцюг приводний', count: 1, price: 900},
            {name: 'Зірочка передня', count: 1, price: 350},
            {name: 'Зірочка задня', count: 1, price: 550},
            {name: 'Мастило для ланцюга', count: 1, price: 180},
        ],
    },
];

const ServiceTemplateSchema = new Schema<IServiceTemplateDocument>(
    {
        userId: {type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
        works: {
            type: [{name: String, price: Number}],
            default: DEFAULT_WORKS,
        },
        materials: {
            type: [{name: String, price: Number}],
            default: DEFAULT_MATERIALS,
        },
        packages: {
            type: [
                {
                    name: String,
                    works: [{name: String, price: Number}],
                    materials: [{name: String, count: Number, price: Number}],
                },
            ],
            default: DEFAULT_PACKAGES,
        },
    },
    {timestamps: true}
);

export default mongoose.models.ServiceTemplate ||
mongoose.model<IServiceTemplateDocument>('ServiceTemplate', ServiceTemplateSchema);