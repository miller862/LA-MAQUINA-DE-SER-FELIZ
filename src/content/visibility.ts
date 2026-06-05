// ─── VISIBILIDAD DE ENTRADAS (fuente única para ES + EN) ─────────────────────
//
// Para OCULTAR una entrada en AMBOS idiomas, agregá su `postId` a esta lista.
// Para volver a publicarla, quitalo. Un solo cambio afecta ES e EN a la vez,
// porque las traducciones comparten el mismo `postId`.
//
// Ejemplo:
//   export const hiddenPostIds = new Set<string>([
//     'analisis-sentimiento',   // ← oculta la entrada en es y en
//   ]);

export const hiddenPostIds = new Set<string>([
  // 'postId-a-ocultar',
]);

// Devuelve true si la entrada debe mostrarse (no está en draft ni oculta por postId).
export function isPublished(entry: { data: { draft?: boolean; postId: string } }): boolean {
  if (entry.data.draft) return false;
  if (hiddenPostIds.has(entry.data.postId)) return false;
  return true;
}
