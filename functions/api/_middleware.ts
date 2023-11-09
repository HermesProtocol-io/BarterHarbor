async function errorHandling(context) {
    try {
      return await context.next();
    } catch (err) {
      return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }
}

function authentication(context) {
    /*
    if (context.request.headers.get("x-email") != "admin@example.com") {
        return new Response("Unauthorized", { status: 403 });
    }
    */
    return context.next();
}

// Respond to OPTIONS method
export const onRequestOptions = async () => {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
    });
};

// Set CORS to all responses
export const corsify = async ({ next }) => {
    const response = await next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
};

export const onRequest = [errorHandling, authentication, corsify];
