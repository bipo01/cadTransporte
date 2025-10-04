import express from "express";
import bodyParser from "body-parser";
import { chromium } from "playwright";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3333;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("home.ejs");
});

app.post("/cadastrar", async (req, res) => {
	const linha = req.body.linha;
	const linhas = linha.split(" ");
	const btnSubmit = req.body.btnSubmit;
	const url = req.body.url;
	const camposDinamicos = Number(req.body.camposDinamicos);
	const camposPadroes = Number(req.body.camposPadroes);

	const inp = {};
	const colunas = {};

	const inpPadrao = {};
	const valorPadrao = {};

	for (let i = 1; i <= camposDinamicos; i++) {
		inp[i] = req.body[`inp${i}`];
		colunas[i] = req.body[`valor${i}`];
	}

	for (let i = 1; i <= camposPadroes; i++) {
		inpPadrao[i] = req.body[`inpPadrao${i}`];
		valorPadrao[i] = req.body[`valorPadrao${i}`];
	}

	console.log(inp);
	console.log(colunas);

	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();

	for (const linha of linhas) {
		const valores = linha.split("\t");

		await page.goto(`${url}`);

		for (let i = 1; i <= camposPadroes; i++) {
			await page.fill(`${inpPadrao[i]}`, `${valorPadrao[i]}`);
		}
		for (let i = 1; i <= camposDinamicos; i++) {
			await page.fill(`${inp[i]}`, `${valores[Number(colunas[i]) - 1]}`);
		}

		if (btnSubmit) {
			await page.click(`${btnSubmit}`);
		}
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
