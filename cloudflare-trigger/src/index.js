const OWNER = "XanderLex05";
const REPO = "oci-capacity-bot";
const WORKFLOW = "oci-capacity-bot.yml";
const REF = "main";
const API_VERSION = "2022-11-28";

function headers(env) {
  return {
    Authorization: `Bearer ${env.GITHUB_PAT}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": API_VERSION,
    "User-Agent": "oci-capacity-trigger"
  };
}

async function triggerWatcher(env) {
  if (!env.GITHUB_PAT) {
    throw new Error("Missing GITHUB_PAT secret");
  }

  const base = `https://api.github.com/repos/${OWNER}/${REPO}`;
  const workflowUrl = `${base}/actions/workflows/${WORKFLOW}`;

  // If the capacity bot already succeeded, it disables its own workflow.
  // In that case the Worker simply stops dispatching new runs.
  const stateResponse = await fetch(workflowUrl, { headers: headers(env) });
  if (!stateResponse.ok) {
    throw new Error(`Unable to read workflow state: ${stateResponse.status}`);
  }

  const workflow = await stateResponse.json();
  if (workflow.state !== "active") {
    console.log(`Watcher is ${workflow.state}; nothing to dispatch.`);
    return;
  }

  const dispatchResponse = await fetch(`${workflowUrl}/dispatches`, {
    method: "POST",
    headers: {
      ...headers(env),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ref: REF })
  });

  if (!dispatchResponse.ok) {
    const body = await dispatchResponse.text();
    throw new Error(`Workflow dispatch failed: ${dispatchResponse.status} ${body}`);
  }

  console.log("OCI capacity workflow dispatched.");
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(triggerWatcher(env));
  },

  async fetch() {
    return new Response(
      "OCI capacity trigger is deployed. Scheduled checks run every 5 minutes.",
      { headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }
};
