module.exports = function (api) {
    const { NODE_ENV, TARGET } = process.env;
    api.cache(() => `${NODE_ENV}${TARGET}`);
    const presets = [
        [
            '@babel/preset-env',
            {
                "targets": {
                    "node": '12.16.3'
                },
            },
        ],
        '@babel/preset-typescript',
    ];
    return {
        presets
    };
};
