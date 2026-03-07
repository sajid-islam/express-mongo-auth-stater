export const getGithubAuthUrl = () => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`;

  return url;
};

export const exchangeGithubCodeForTokens = async (code: string) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_OAUTH_CLIENT_ID!,
    client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
    code,
    redirect_uri: process.env.GITHUB_REDIRECT_URI!,
  });
  const res = await fetch(`https://github.com/login/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
};

export const fetchGithubUser = async (access_token: string) => {
  const res = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return res.json();
};
