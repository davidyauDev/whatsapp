import HandleWhatsApp from "./HandleWhatsApp";
const { saveExternalFile, checkIsUrl } = new HandleWhatsApp();
class FlowWhatsApp {
    async getMessages(message: string) {
        // const data = await get(message)
        // return data
    }
    async responseMessages(step: any) {
        const data = await this.reply(step);
        if (data && data.media) {
            const file: any = checkIsUrl(data.media) ? await saveExternalFile(data.media) : data.media;
            return { ...data, ...{ media: file } };
        }
        return data;
    }
    async reply(url: string): Promise<{ media: string, trigger: null, replyMessage: string }> {
        return new Promise((resolve, reject) => {
            let resData = { replyMessage: "", media: url, trigger: null };
            resData = {
                ...resData,
            };
            resolve(resData);
        });
    }
    async responseMessagesPost(url: string) {
        const data = await this.reply(url)
        if (data && data.media) {
            const file: any = checkIsUrl(data.media) ? await saveExternalFile(data.media) : data.media;
            return { ...data, ...{ media: file } }
        }
        return data
    }
}

export default new FlowWhatsApp();
