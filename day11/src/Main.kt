import java.util.Arrays

class Counted(var value: Long) {
    var count: Long

    init {
        this.count = 1
    }

    constructor(value: Long, count: Long) : this(value) {
        this.count = count
    }

    fun increase(v: Long)
    {
        this.count+=v
    }

    fun decrease(v: Long) {
        this.count-=v
    }
}

private fun blinkNum(value: Long): Array<Long> {
    if (value == 0L) {
        return arrayOf(1)
    } else if (value.toString().length % 2 == 0) {
        val len = value.toString().length
        val half = len / 2
        val left = value.toString().substring(0..<half).toLong()
        val right = value.toString().substring(half).toLong()
        return arrayOf(left, right)
    } else {
        return arrayOf(value * 2024)
    }
}

private fun extractData(data: String): List<Counted> {
    val split = data.split(" ")
    val result: List<Counted> = split.map { Counted(it.toLong()) }
    return result
}

private fun add(l: List<Counted>, v: Long): List<Counted> {
    return add(l, Counted(v))
}

private fun add(l: List<Counted>, v: Counted): List<Counted> {
    val i = l.indexOfFirst { it.value == v.value }
    if (i > -1) {
        l[i].increase(v.count)
        return l
    } else {
        return l.plus(v)
    }
}

fun main() {
    var elements = extractData("20 82084 1650 3 346355 363 7975858 0")

    for (_index in 0..75) {
        println("$_index : ${elements.map { it.count }.reduce(Long::plus)}")
        var newItems = listOf<Counted>()
        for (i in elements.indices) {
            val element = elements[i]
            val blink = blinkNum(element.value)
            for (blinked in blink) {
                newItems = add(newItems, Counted(blinked, element.count))
            }
        }
        elements = newItems
    }

    println(elements.map { it.count }.reduce(Long::plus))
}
