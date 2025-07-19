
"use client";

import withAuth from "@/components/layout/withAuth";
import TokensClient from "@/components/tokens/tokens-client";

function TokensPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Gestión de Tokens de API</h1>
      </div>
      <TokensClient />
    </main>
  );
}

export default withAuth(TokensPage);
