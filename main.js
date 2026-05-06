const { Plugin } = require('obsidian');

module.exports = class NextDayFilePlugin extends Plugin {
    async onload() {
        // --- リボンアイコンの追加 ---
        this.addRibbonIcon('calendar-plus', '翌日の日記を作成', (evt) => {
            this.openNextDayFile();
        });

        this.addCommand({
            id: 'create-next-day-file',
            name: '明日（翌日）の日記を作成/開く',
            callback: () => this.openNextDayFile(),
        });
    }

    async openNextDayFile() {
        const moment = window.moment;
        const folderName = "日記"; // 保存したいフォルダ名
        const fileName = moment().add(1, 'days').format('YYYY-MM-DD') + '.md';
        const filePath = `${folderName}/${fileName}`;

        // 1. 「日記」フォルダが存在するか確認し、なければ作成
        const folder = this.app.vault.getAbstractFileByPath(folderName);
        if (!folder) {
            await this.app.vault.createFolder(folderName);
        }

        // 2. ファイルが既に存在するか確認
        let file = this.app.vault.getAbstractFileByPath(filePath);

        if (!file) {
            // 3. 存在しない場合は新規作成（「日記/202X-XX-XX.md」として作成）
            file = await this.app.vault.create(filePath, "");
        }

        // 4. ファイルを開く
        const leaf = this.app.workspace.getLeaf(false);
        await leaf.openFile(file);
    }
};