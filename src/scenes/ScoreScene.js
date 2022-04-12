import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {
    constructor(config) {
        super('ScoreScene', { ...config, canGoBack: true });
    }
    create() {
        super.create();
        let bestScore = localStorage.getItem('bestScore') || 0;
        this.add.text(this.config.width / 2, this.config.height / 2, `Best Score: ${bestScore} `, { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}

export default ScoreScene;
