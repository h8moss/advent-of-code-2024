cmake_minimum_required(VERSION 3.10)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

project(day13 VERSION 1.0.0)

include_directories(
  ${CMAKE_SOURCE_DIR}/include
)

# Add warnings to compilation
set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -g -DDEBUG -Wall -Weffc++ -Wextra -Wconversion -Wsign-conversion")

set(SHARED_SOURCES 
  ${CMAKE_SOURCE_DIR}/util/position.cc
  ${CMAKE_SOURCE_DIR}/util/problem.cc
)

# Sources for each part
set(P1_SOURCES ${SHARED_SOURCES} ${CMAKE_SOURCE_DIR}/p1.cc)
set(P2_SOURCES ${SHARED_SOURCES} ${CMAKE_SOURCE_DIR}/p2.cc)

# Add executables
add_executable(p1 ${P1_SOURCES})
add_executable(p2 ${P2_SOURCES})

