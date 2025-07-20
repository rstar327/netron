
const transformers = {};

transformers.ModelFactory = class {

    async match(context) {
        const obj = await context.peek('json');
        if (obj) {
            if (obj.model_type && obj.architectures) {
                return context.set('transformers.config', obj);
            }
            if (obj.tokenizer_class ||
                (obj.bos_token && obj.eos_token && obj.unk_token) ||
                (obj.pad_token && obj.additional_special_tokens) ||
                (obj.version && obj.added_tokens && obj.model) ||
                obj.special_tokens_map_file || obj.full_tokenizer_file) {
                return context.set('transformers.tokenizer', obj);
            }
        }
        return null;
    }

    async open(context) {
        return new transformers.Model(context.value);
    }
};

transformers.Model = class {

    constructor(config) {
        this.format = 'Transformers';
        this.metadata = [];
        for (const key of Object.entries(config)) {
            const argument = new transformers.Argument(key[0], key[1]);
            this.metadata.push(argument);
        }
    }
};

transformers.Graph = class {

};

transformers.Argument = class {

    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
};

transformers.Error = class extends Error {

    constructor(message) {
        super(message);
        this.name = 'Error loading Transformers model.';
    }
};

export const ModelFactory = transformers.ModelFactory;
