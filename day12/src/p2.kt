import java.io.BufferedReader
import java.io.File

enum class Direction {
    Top, Bottom, Left, Right
}

class Position(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Position) return false
        return this.x == other.x && this.y == other.y
    }

    override fun hashCode(): Int {
        return javaClass.hashCode()
    }
}

class PerimeterData(
    val position: Position,
    val exitTop: Boolean,
    val exitRight: Boolean,
    val exitBottom: Boolean,
    val exitLeft: Boolean
) {}

fun part2() {
    val bufferedReader: BufferedReader = File("input.test.txt").bufferedReader()
    val inputString = bufferedReader.use { it.readText() }
    val matrix = inputString
        .replace("\r", "")
        .split("\n")

    val h = matrix.size
    val w = matrix[0].length

    val perimeters = mutableMapOf<Int, MutableList<PerimeterData>>()
    val areas = mutableMapOf<Int, Int>()
    val visited = mutableListOf<Pair<Int, Int>>()

    var currentID = 0

    fun posIsEdge(position: Position): Boolean {
        return position.x == 0 || position.y == 0 || position.x == w - 1 || position.y == h - 1
    }

    fun posExists(position: Position): Boolean {
        return position.x >= 0 && position.y >= 0 && position.x < w && position.y < h
    }

    fun checkPosition(pos: Position) {
        val x = pos.x
        val y = pos.y
        if (visited.contains(Pair(x, y))) {
            return
        }
        visited.add(Pair(x, y))
        areas[currentID] = areas[currentID]!! + 1

        // Check if we are on the edge of the matrix, if we are, we are perimeter
        if (posIsEdge(pos)) {
            perimeters[currentID]!!.add(
                PerimeterData(
                    position = pos,
                    exitTop = (y == 0),
                    exitRight = (x == w - 1),
                    exitBottom = (y == h - 1),
                    exitLeft = (x == 0)
                )
            )
        }

        for ((current, dir) in arrayOf(
            Pair(Position(x - 1, y), Direction.Left),
            Pair(Position(x + 1, y), Direction.Right),
            Pair(Position(x, y - 1), Direction.Top),
            Pair(Position(x, y + 1), Direction.Bottom),
        )) {
            if (posExists(current)) {
                if (matrix[current.y][current.x] == matrix[pos.y][pos.x]) {
                    checkPosition(current)
                } else {
                    perimeters[currentID]!!.add(
                        PerimeterData(
                            position = pos,
                            exitTop = dir == Direction.Top,
                            exitRight = dir == Direction.Right,
                            exitBottom = dir == Direction.Bottom,
                            exitLeft = dir == Direction.Left
                        )
                    )
                }
            }
        }
    }

    for (y in matrix.indices) {
        for (x in matrix[y].indices) {
            areas[currentID] = 0
            perimeters[currentID] = mutableListOf()
            checkPosition(Position(x, y))

            currentID++
        }
    }

    var sum = 0

    for (id in 0..currentID) {
        val area = areas[id]!!
        val perimeter = perimeters[id]!!
        val initialPos = perimeter.first { it.exitTop };
        var currentPos = initialPos
        var sideCount = 1
        var currentSide = Direction.Top
        do {
            val nextPos = when (currentSide) {
                Direction.Top -> Position(currentPos.position.x + 1, currentPos.position.y)
                Direction.Right -> Position(currentPos.position.x, currentPos.position.y + 1)
                Direction.Left -> Position(currentPos.position.x, currentPos.position.y - 1)
                Direction.Bottom -> Position(currentPos.position.x - 1, currentPos.position.y)
            }
            // if perimeter includes nextPos, we are still along the perimeter, if not we must turn and add the number of sides
            val nextPosIndex = perimeter.indexOfFirst { it.position == nextPos }
            if (nextPosIndex != -1) {
                currentPos = perimeter[nextPosIndex]
            } else {
                sideCount++
                currentSide = when (currentSide) {
                    Direction.Top -> Direction.Right
                    Direction.Right -> Direction.Bottom
                    Direction.Bottom -> Direction.Left
                    Direction.Left -> Direction.Top
                }
            }
        } while (!(currentPos.position.equals(initialPos.position)) && currentSide != Direction.Top)

        println("$sum + ($sideCount * $area) = ${sum + sideCount * area}")
        sum += sideCount * area
    }

    println("====================================")
    println("FINAL RESULT: $sum")
    println("====================================")
}
