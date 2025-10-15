export default function loadConfig(filePath) {
    let configContent = open(filePath);
    if (!configContent) {
        throw new Error("Could not open config.jsonc");
    }

    // pretend it's JSONC
    configContent = configContent.replace(/^\s*\/\/.*$/gm, '');

    try {
        return JSON.parse(configContent);
    } catch (e) {
        throw new Error("Could not parse config.jsonc: " + e.message);
    }
}
