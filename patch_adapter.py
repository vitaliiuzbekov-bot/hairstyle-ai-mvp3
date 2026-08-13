with open("src/server/adapters/FalAdapter.ts", "r") as f:
    content = f.read()

old_call = '''      const result = await imageGenQueue.add(() => fal.run<any, any>("fal-ai/flux/dev", {
        input: {
          prompt: options.prompt,
          image_url: options.imageUrl,
          strength: options.strength,
          num_inference_steps: 12
        }
      }));'''

new_call = '''      const endpoint = options.imageUrl ? "fal-ai/flux/dev/image-to-image" : "fal-ai/flux/dev";
      const result = await imageGenQueue.add(() => fal.run<any, any>(endpoint, {
        input: {
          prompt: options.prompt,
          image_url: options.imageUrl || undefined,
          strength: options.strength || 0.8,
          num_inference_steps: 12
        }
      }));'''

content = content.replace(old_call, new_call)

with open("src/server/adapters/FalAdapter.ts", "w") as f:
    f.write(content)
