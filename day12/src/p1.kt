import java.io.BufferedReader
import java.io.File


fun part1()
{
    val bufferedReader: BufferedReader = File("input.test.txt").bufferedReader()
    val inputString = bufferedReader.use { it.readText() }
    val matrix = inputString
        .replace("\r", "")
        .split("\n")

    val h = matrix.size
    val w = matrix[0].length

    val processedPositions = mutableListOf<Pair<Int, Int>>()

    fun printM() {
        for (y in 0..<h) {
            var line = ""
            for (x in 0..<w) {
                var c = matrix[y][x]
                if (!processedPositions.contains(Pair(x, y))) {
                    c = '.'
                }
                line += c
            }
            println(line)
        }
    }

    fun getPos(x: Int, y: Int): Char? {
        if (x < 0 || y < 0 || x >= w || y >= h) return null
        return matrix[y][x]
    }

    fun checkAdjacent(x: Int, y: Int): Pair<Int, Int> {
        printM()
        val c = matrix[y][x]
        var perimeter = 0
        var area = 1
        for ((iX,iY) in arrayOf(
            Pair(x-1,y),
            Pair(x+1,y),
            Pair(x,y-1),
            Pair(x,y+1)
        )) {
            if (getPos(iX, iY) == c) {
                if (processedPositions.contains(Pair(iX,iY))) { continue }
                processedPositions.add(Pair(iX,iY))
                val (dPerimeter, dArea) = checkAdjacent(iX, iY)
                area += dArea
                perimeter += dPerimeter
            } else {
                perimeter++
            }
        }
        return Pair(perimeter, area)
    }

    var sum = 0

    for (y in matrix.indices) {
        for (x in matrix[0].indices) {
            if (processedPositions.contains(Pair(x, y))) {
                continue
            }
            processedPositions.add(Pair(x, y))
            val (perimeter, area) = checkAdjacent(x, y)
            sum += perimeter * area
            println(sum)
            println(processedPositions.size)
            println("x: $x, y: $y")
        }
    }
}

/*
 +-------+
 | e e e |
 |   +---+
 | e |
 |   +---+
 | e e e |
 |   +---+
 | e |
 |   +---+
 | e e e |
 +-------+

 */