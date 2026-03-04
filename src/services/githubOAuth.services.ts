export const getGithubAuthUrl = () => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`;

  return url;
};

export const exchangeGithubCodeForTokens = async (code: string) => {
  const res = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&client_secret=${process.env.GITHUB_OAUTH_CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
};
