const app = require('./index');
const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server listen on port ${PORT}`);
    });
}