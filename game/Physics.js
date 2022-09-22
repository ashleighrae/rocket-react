import Matter from "matter-js";

const Physics = (entities, { touches, time, dispatch }) => {
  let engine = entities.physics.engine;
  let rocket = entities.rocket.body;
  let world = entities.physics.world;
  let correctWord = entities.correctWord.body;

  let hadTouches = false;

  touches.filter(t => t.type === "start").forEach(t => {
    if (!hadTouches) {
      if (world.gravity.y === 0.0) {
        world.gravity.y = 1.2;
      }

      hadTouches = true;
      Matter.Body.setVelocity(rocket, {
        x: rocket.velocity.x,
        y: -7
      });
    }
  });

  Matter.Body.translate(entities["correctWord"].body, { x: -1, y: 0 });
  Matter.Body.translate(entities["incorrectWord"].body, { x: -1, y: 0 });
  
  Matter.Engine.update(engine, time.delta);

  return entities;
};

export default Physics;