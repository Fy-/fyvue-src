import { renderToString } from "@vue/server-renderer";
import { renderHeadToString } from "@vueuse/head";
import { getPrefix, getUuid, getPath } from "@karpeleslab/klbfw";

function renderPreloadLinks(modules, manifest) {
  let links = "";
  const seen = new Set();
  modules.forEach((id) => {
    const entry = Object.keys(manifest).find((entry) => {
      if (entry.startsWith(id)) return true;
    });

    const files = manifest[entry];

    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file);
          links += renderPreloadLink(file);
        }
      });
    }
  });

  return links;
}

function renderPreloadLink(file) {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" href="${file}">`;
  } else if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (
    file.includes("preload_") &&
    (file.endsWith(".jpg") || file.endsWith(".jpeg"))
  ) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.includes("preload_") && file.endsWith(".png")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    // TODO
    return "";
  }
}

export async function handleSSR(createApp, cb, options = {}) {
  const { app, router, head } = await createApp(true);
  const result = { uuid: getUuid(), initial: {} };
  const ctx = {};
  const url = `${getPath()}`;
  router.push(url);
  await router.isReady();
  let appHtml = "";
  try {
    appHtml = await renderToString(app, ctx);
  } catch (e) {
    router.push(`${getPrefix()}/404`);
    await router.isReady();
    appHtml = await renderToString(app, ctx);
    result.statusCode = 404;
    result.app = appHtml;
    return cb(result);
  }
  if (url != router.currentRoute.value.fullPath) {
    if (router.currentRoute.value.name == "NotFound") {
      router.push(`${getPrefix()}/404`);
      await router.isReady();
      appHtml = await renderToString(app, ctx);
      result.statusCode = 404;
      result.app = appHtml;
      return cb(result);
    } else {
      result.statusCode = 301;
      result.redirect = router.currentRoute.value.fullPath;
      return cb(result);
    }
  }
  const preloadLinks = renderPreloadLinks(ctx.modules, {});
  const { headTags, htmlAttrs, bodyAttrs, bodyTags } = renderHeadToString(head)
  result.meta = headTags
  result.link = preloadLinks
  result.bodyAttributes = bodyAttrs
  result.htmlAttributes = htmlAttrs
  result.bodyTags = bodyTags
  result.app = appHtml
  result.statusCode = router.currentRoute.value.name == "NotFound" ? 404 : 200
  return cb(result)
}