const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const baseURL = "https://api.github.com";
const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  }

async function getLabels(repo) {
  try {
    const response = await fetch(`${baseURL}/repos/${repo}/labels`, { method: 'GET', headers })
    if(!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching labels from ${repo}:`, error.response?.data || error.message);
    return [];
  }
}

async function createLabel(repo, label) {
  try {
    const body = {
        name: label.name,
        color: label.color,
        description: label.description || "",
      }
    const response = await fetch(`${baseURL}/repos/${repo}/labels`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })
    if(!response.ok) {
        console.log(response)
        throw Error(response.statusText)
    }
    return response.json();
  } catch (error) {
    console.log(error)
    if (error.response?.status === 422) {
      console.log(`Label already exists: ${label.name}`);
    } else {
      console.error(`Error creating label: ${label.name}`, error.response?.data || error.message);
    }
  }
}

async function syncLabels(source, target) {
  const sourceLabels = await getLabels(source);
  const toAdd = sourceLabels.filter(label => !label.default);
  await Promise.all(toAdd.map(label => createLabel(target, label)))
}

function parsePath(path) {
    if(path.startsWith(`/`)) {
        path = path.split('').slice(1).join('')
    }
    if(path.endsWith(`/`)) {
        path = path.split('').slice(0, path.length-2).join('')
    }
    path = path.toLowerCase();
    console.log(path)
    if(path && path.split('').filter(char => char === `/`).length === 1) {
        return path
    }

    throw Error(`Path ${path} is invalid.`)
}

const [, , source, target] = process.argv;
syncLabels(parsePath(source), parsePath(target));