-- Update existing trigger configurations to remove exclude keywords
UPDATE "Trigger"
SET config = jsonb_set(
  config,
  '{keywords}',
  jsonb_build_object('include', config->'keywords'->'include')
)
WHERE config->>'keywords' IS NOT NULL
  AND config->'keywords'->>'exclude' IS NOT NULL; 