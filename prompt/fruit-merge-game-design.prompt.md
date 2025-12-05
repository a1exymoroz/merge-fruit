1. Game Concept and Goal
Game Name: Fruit Merge (or similar working title).

Core Concept: A physics-based puzzle game where the player drops various sized fruits into a container.

Goal: Merge identical, adjacent fruits to create the next larger fruit in the sequence. The ultimate goal is to reach the largest fruit (e.g., the Watermelon) without letting the fruits stack past the designated "Game Over" line at the top of the container.


2. Core Mechanics
Dropping: The player can tap or click an area at the top of the screen to drop a single, randomly chosen fruit from the starting set (e.g., Cherry, Strawberry, Grape).

Physics: Implement realistic 2D physics (collision detection, rolling, stacking) as fruits are dropped and interact within the container.

Merging: When two identical fruits touch, they immediately disappear and are replaced by a single, new fruit of the next level/size, generated at the point of collision.

Combo/Chain Reactions: Merging should be able to trigger subsequent merges (chain reactions) if the newly created fruit touches another identical fruit.

3. Fruit Progression (The Merge Sequence)
Requirement: Define a clear, increasing sequence of fruits by size, from smallest (Level 1) to largest (Level 11).

Example Sequence:Cherry (Smallest) -> 2. Strawberry -> 3. Grape -> 4. Dekopon -> 5. Persimmon -> 6. Apple -> 7. Pear -> 8. Pineapple -> 9. Melon -> 10. Coconut -> 11. Watermelon (Largest/Goal)
Spawning: Initially, only the first 3-5 smallest fruits should be available to drop randomly.


4. User Interface (UI) Elements
Game Area: A large, clear container/box with a visible "Game Over" Line marked near the top.

Next Fruit Display: Show the next fruit that will be dropped in the queue.

Score: A visible counter that increases with every successful merge (larger fruits should yield more points).

High Score: Display the player's all-time highest score.

5. Game Over Condition
Trigger: The game ends immediately when any part of a fruit crosses and remains above the "Game Over" Line for a specified short duration (e.g., 2 seconds).

End Screen: Display the final score and prompt the player to start a new game.