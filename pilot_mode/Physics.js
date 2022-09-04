import Matter from "matter-js";

const Physics = (entities, { touches, time, dispatch }) => {
  let engine = entities.physics.engine;
  let rocket = entities.rocket.body;
  let world = entities.physics.world;

  let hadTouches = false;

  touches.filter(t => t.type === "start").forEach(t => {
    if (!hadTouches) {
      if (world.gravity.y === 0.0) {
        world.gravity.y = 1.2;
      }

      hadTouches = true;
      Matter.Body.applyForce(rocket, rocket.position, { x: 0.00, y: -0.08 });
    }
  });

  // if (// Word exists on other person's screen, fly to it) {
    Matter.Body.translate(entities["correctWord"].body, { x: -1, y: 0 });
    Matter.Body.translate(entities["incorrectWord"].body, { x: -1, y: 0 });
  // }

  Matter.Engine.update(engine, time.delta);

  return entities;
};

export default Physics;