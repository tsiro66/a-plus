import { r as __exportAll } from "./rolldown-runtime_DWOOXAbm.mjs";
import { a as getEnvFieldType, i as setOnSetGetEnv, n as getEnv$1, o as validateEnvVariable, t as createInvalidVariablesError } from "./runtime_BQQVKFN6.mjs";
//#region \0virtual:astro:env/internal
var schema = { "RESEND_API_KEY": {
	"type": "string",
	"context": "server",
	"access": "secret"
} };
//#endregion
//#region \0astro:env/server
/** @returns {string} */
var getEnv = (key) => {
	return getEnv$1(key);
};
var _internalGetSecret = (key) => {
	const rawVariable = getEnv(key);
	const variable = rawVariable === "" ? void 0 : rawVariable;
	const options = schema[key];
	const result = validateEnvVariable(variable, options);
	if (result.ok) return result.value;
	throw createInvalidVariablesError(key, getEnvFieldType(options), result);
};
setOnSetGetEnv(() => {
	RESEND_API_KEY = _internalGetSecret("RESEND_API_KEY");
});
var RESEND_API_KEY = _internalGetSecret("RESEND_API_KEY");
var footer_default = {
	navTitle: "Πλοήγηση",
	navLinks: [
		{
			"label": "Ποιοι είμαστε",
			"href": "/about"
		},
		{
			"label": "Υπηρεσίες",
			"href": "/services"
		},
		{
			"label": "Τα έργα μας",
			"href": "/work"
		},
		{
			"label": "Επικοινωνία",
			"href": "/contact"
		}
	],
	contactTitle: "Επικοινωνία",
	email: "aplus.engineers@yahoo.com",
	phone: "+30 211 118 8928",
	location: "Νέα Ιωνία, Ελλάδα",
	social: [
		{
			"platform": "facebook",
			"href": "#"
		},
		{
			"platform": "instagram",
			"href": "#"
		},
		{
			"platform": "linkedin",
			"href": "#"
		}
	],
	ctaTitle: "Ξεκινήστε",
	ctaText: "Έτοιμοι να συζητήσουμε το επόμενο έργο σας.",
	copyright: "© 2026 A+. Με επιφύλαξη παντός δικαιώματος.",
	privacyLabel: "Πολιτική Απορρήτου",
	termsLabel: "Όροι Χρήσης"
};
//#endregion
//#region src/pages/api/contact.ts
var contact_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var RESEND_ENDPOINT = "https://api.resend.com/emails";
var FROM = "A+ Website Contact Form <contact@a-plus.gr>";
var TO = [footer_default.email];
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var json = (body, status = 200) => new Response(JSON.stringify(body), {
	status,
	headers: { "Content-Type": "application/json" }
});
var POST = async ({ request, url }) => {
	const origin = request.headers.get("origin");
	if (origin && origin !== url.origin) return json({
		ok: false,
		error: "forbidden"
	}, 403);
	let data;
	try {
		data = await request.json();
	} catch {
		return json({
			ok: false,
			error: "invalid_body"
		}, 400);
	}
	if (typeof data.website === "string" && data.website.trim() !== "") return json({ ok: true });
	const name = typeof data.name === "string" ? data.name.trim() : "";
	const email = typeof data.email === "string" ? data.email.trim() : "";
	const phone = typeof data.phone === "string" ? data.phone.trim() : "";
	const message = typeof data.message === "string" ? data.message.trim() : "";
	if (!name || name.length > 100) return json({
		ok: false,
		error: "name"
	}, 400);
	if (!email || email.length > 200 || !EMAIL_RE.test(email)) return json({
		ok: false,
		error: "email"
	}, 400);
	if (phone.length > 40) return json({
		ok: false,
		error: "phone"
	}, 400);
	if (!message || message.length > 5e3) return json({
		ok: false,
		error: "message"
	}, 400);
	const text = [
		`Νέο μήνυμα από τη φόρμα επικοινωνίας`,
		``,
		`Όνομα: ${name}`,
		`Email: ${email}`,
		`Τηλέφωνο: ${phone || "—"}`,
		``,
		`Μήνυμα:`,
		message
	].join("\n");
	try {
		const res = await fetch(RESEND_ENDPOINT, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${RESEND_API_KEY}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				from: FROM,
				to: TO,
				reply_to: email,
				subject: `Φόρμα επικοινωνίας — ${name}`,
				text
			})
		});
		if (!res.ok) {
			const detail = await res.text();
			console.error("Resend error:", res.status, detail);
			return json({
				ok: false,
				error: "send_failed"
			}, 502);
		}
		return json({ ok: true });
	} catch (err) {
		console.error("Resend request failed:", err);
		return json({
			ok: false,
			error: "send_failed"
		}, 502);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/contact@_@ts
var page = () => contact_exports;
//#endregion
export { page };
